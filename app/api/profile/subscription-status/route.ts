import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.profile.findUnique({
      where: {
        userId: clerkUser.id,
      },
      select: {
        subscriptionActive: true,
        subscriptionTier: true,
        subscriptionInterval: true,
        cancelAtPeriodEnd: true,
        usage: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Free trial limit
    const FREE_TRIAL_LIMIT = 5;

    return NextResponse.json(
      {
        isSubscribed: user.subscriptionActive,
        subscriptionTier: user.subscriptionTier,
        subscriptionInterval: user.subscriptionInterval,
        cancelAtPeriodEnd: user.cancelAtPeriodEnd,
        usage: user.usage,
        limit: user.subscriptionActive ? null : FREE_TRIAL_LIMIT,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
