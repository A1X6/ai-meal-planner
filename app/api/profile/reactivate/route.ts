import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";

export async function POST() {
  try {
    // Get the authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { stripeSubscriptionId: true, cancelAtPeriodEnd: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    if (!profile.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // If the subscription is not set to cancel, nothing to reactivate
    if (!profile.cancelAtPeriodEnd) {
      return NextResponse.json(
        { error: "Subscription is not scheduled for cancellation" },
        { status: 400 }
      );
    }

    // Reactivate the subscription by updating the cancellation status
    await stripe.subscriptions.update(
      profile.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

    // Update the database to reflect the change
    await prisma.profile.update({
      where: { userId: user.id },
      data: { cancelAtPeriodEnd: false },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription reactivated successfully",
    });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json(
      { error: "Failed to reactivate subscription" },
      { status: 500 }
    );
  }
}
