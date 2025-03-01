import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { billingInterval, name, userId, email, priceId, priceIdYearly } =
      await request.json();

    if (
      !userId ||
      !email ||
      !billingInterval ||
      !name ||
      !priceId ||
      !priceIdYearly
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const allowedPlans = ["Premium", "Family"];

    if (!allowedPlans.includes(name)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: billingInterval === "month" ? priceId : priceIdYearly,
          quantity: 1,
        },
      ],
      mode: "subscription",
      metadata: {
        clerkUserId: userId,
        email,
        name,
        billingInterval,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
