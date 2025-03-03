import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    const { newPlanId, returnUrl } = await req.json();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!newPlanId) {
      return NextResponse.json({ error: "Missing plan ID" }, { status: 400 });
    }

    // Get the user's profile from your database
    const userProfile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
      select: { stripeSubscriptionId: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Create a Stripe customer if not exists
    let customerId;
    const customer = await stripe.customers.list({
      email: clerkUser.emailAddresses[0].emailAddress,
      limit: 1,
    });

    if (customer.data.length === 0) {
      const newCustomer = await stripe.customers.create({
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.firstName + " " + clerkUser.lastName,
      });
      customerId = newCustomer.id;
    } else {
      customerId = customer.data[0].id;
    }

    // If the user already has a subscription, update it directly
    if (userProfile.stripeSubscriptionId) {
      try {
        // Retrieve the current subscription to get the subscription item ID
        const currentSubscription = await stripe.subscriptions.retrieve(
          userProfile.stripeSubscriptionId
        );

        // Get the first subscription item ID (assuming one item per subscription)
        const subscriptionItemId = currentSubscription.items.data[0].id;

        // Directly update the subscription with the new price
        const updatedSubscription = await stripe.subscriptions.update(
          userProfile.stripeSubscriptionId,
          {
            cancel_at_period_end: false,
            items: [
              {
                id: subscriptionItemId,
                price: newPlanId,
              },
            ],
            // Prorate by default to calculate the cost difference
            proration_behavior: "create_prorations",
          }
        );

        // Update the user's subscription details in your database if needed
        // For example, update tier and interval information based on the new plan

        // Get the price object to determine tier and interval
        const priceInfo = await stripe.prices.retrieve(newPlanId);
        const productInfo = await stripe.products.retrieve(
          priceInfo.product as string
        );

        // Extract subscription details
        const subscriptionTier = productInfo.metadata.tier || "premium";
        const subscriptionInterval = priceInfo.recurring?.interval || "month";

        // Update the profile in the database
        await prisma.profile.update({
          where: { userId: clerkUser.id },
          data: {
            subscriptionActive: true,
            subscriptionTier,
            subscriptionInterval,
            // Keep the existing stripeSubscriptionId since we're just updating the plan
          },
        });

        // Return success with updated subscription details
        return NextResponse.json({
          success: true,
          message: "Subscription updated successfully",
          subscription: {
            id: updatedSubscription.id,
            status: updatedSubscription.status,
            currentPeriodEnd: new Date(
              updatedSubscription.current_period_end * 1000
            ),
          },
        });
      } catch (stripeError) {
        console.error("[STRIPE_UPDATE_ERROR]", stripeError);
        return NextResponse.json(
          { error: "Failed to update subscription", details: stripeError },
          { status: 500 }
        );
      }
    } else {
      // If the user doesn't have a subscription yet, create a new checkout session

      // Get the price object to determine tier and interval
      const priceInfo = await stripe.prices.retrieve(newPlanId);
      const productInfo = await stripe.products.retrieve(
        priceInfo.product as string
      );

      // Extract subscription details
      const subscriptionTier = productInfo.metadata.tier || "premium";
      const subscriptionInterval = priceInfo.recurring?.interval || "month";

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: newPlanId,
            quantity: 1,
          },
        ],
        metadata: {
          clerkUserId: clerkUser.id,
          subscriptionTier,
          subscriptionInterval,
        },
        success_url:
          returnUrl ||
          `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (error) {
    console.error("[CHANGE_PLAN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
