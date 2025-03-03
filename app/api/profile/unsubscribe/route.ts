import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's profile from the database
    const userProfile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
      select: {
        stripeSubscriptionId: true,
        subscriptionActive: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if the user has an active subscription
    if (!userProfile.subscriptionActive || !userProfile.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    try {
      // Cancel the subscription in Stripe
      await stripe.subscriptions.update(userProfile.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update the database to mark the subscription as pending cancellation
      // Note: The webhook will completely remove the subscription when it's actually canceled
      await prisma.profile.update({
        where: { userId: clerkUser.id },
        data: {
          // We don't set subscriptionActive to false yet because the subscription
          // is still active until the end of the billing period
          cancelAtPeriodEnd: true,
        },
      });

      return NextResponse.json({
        success: true,
        message:
          "Subscription will be canceled at the end of the billing period",
      });
    } catch (stripeError) {
      console.error("[STRIPE_CANCELLATION_ERROR]", stripeError);
      return NextResponse.json(
        { error: "Failed to cancel subscription", details: stripeError },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[UNSUBSCRIBE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
