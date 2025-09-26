import { NextResponse } from "next/server";

// GET /api/billing/plans - mock plans
export async function GET() {
  const plans = [
    { id: "free", name: "Free", price: 0, features: ["1 workspace", "Basic scheduling"] },
    { id: "pro", name: "Pro", price: 19, features: ["3 workspaces", "Advanced scheduling", "Media library"] },
    { id: "team", name: "Team", price: 49, features: ["Unlimited workspaces", "Team roles", "Priority support"] },
  ];
  return NextResponse.json({ data: plans });
}
