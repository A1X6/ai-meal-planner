import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleCustomerSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
  return NextResponse.json({ message: "Event received" }, { status: 200 });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.clerkUserId;
  if (!userId) {
    console.error("No user ID found in checkout session metadata");
    return;
  }

  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.error("No subscription ID found in checkout session");
    return;
  }
  try {
    await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true,
        subscriptionTier: session.metadata?.subscriptionTier as string,
        subscriptionInterval: session.metadata?.subscriptionInterval as string,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    console.error("No subscription ID found in invoice");
    return;
  }

  let userId: string | undefined;
  try {
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });
    if (!profile?.userId) {
      console.error("No profile found for subscription ID:", subscriptionId);
      return;
    }
    userId = profile.userId;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return;
  }
  try {
    await prisma.profile.update({
      where: { userId },
      data: { subscriptionActive: false },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
  }
  
}

async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const subscriptionId = subscription.id;

  let userId: string | undefined;
  try {
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });
    if (!profile?.userId) {
      console.error("No profile found for subscription ID:", subscriptionId);
      return;
    }
    userId = profile.userId;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    return;
  }
  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
        stripeSubscriptionId: null,
        subscriptionInterval: null,
        subscriptionTier: null,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
