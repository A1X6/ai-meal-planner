import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    const email = clerkUser?.emailAddresses[0].emailAddress;
    const userName = clerkUser?.username;

    if (!email || !userName) {
      return NextResponse.json(
        { error: "User email and username are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.profile.findUnique({
      where: {
        email: email,
        userName: userName,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    await prisma.profile.create({
      data: {
        userId: clerkUser.id,
        email,
        userName,
        subscriptionActive: false,
        subscriptionTier: null,
        stripeSubscriptionId: null,
      },
    });

    console.log(`Prisma profile created for user: ${clerkUser.id}`);
    return NextResponse.json(
      { message: "Profile created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create-profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
