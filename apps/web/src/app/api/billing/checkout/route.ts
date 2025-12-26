import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSessionAndWorkspace } from "@/lib/guards";
import { handleApiError, errors } from "@/lib/errors";
import { validateRequest } from "@/lib/validation";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { patterns } from "@/lib/validation/schemas";

// Valid subscription plans - prevents plan injection attacks
const VALID_PLANS = ['free', 'pro', 'enterprise'] as const;

// Schema for checkout request with strict plan validation
const checkoutSchema = z.object({
  workspaceId: patterns.cuid,
  plan: z.enum(VALID_PLANS, {
    message: `Plan must be one of: ${VALID_PLANS.join(', ')}`
  }),
});

// POST /api/billing/checkout - mock checkout session
export async function POST(req: NextRequest) {
  try {
    // Require authentication and workspace membership
    const { workspaceId: authenticatedWorkspaceId, userId } = await requireSessionAndWorkspace();

    // Validate request body with strict schema to prevent plan injection
    const { workspaceId, plan } = await validateRequest(req, checkoutSchema);
    
    // Verify user owns the workspace they're trying to upgrade
    if (workspaceId !== authenticatedWorkspaceId) {
      logger.warn('Billing: workspace mismatch', { 
        requestedWorkspace: workspaceId, 
        authenticatedWorkspace: authenticatedWorkspaceId,
        userId 
      });
      throw errors.forbidden('Cannot modify subscription for another workspace');
    }
    
    logger.info('Processing checkout', { workspaceId, plan, userId });

    // Mock: create/update subscription immediately
    await prisma.subscription.upsert({
      where: { workspaceId },
      update: { plan, status: "active", currentPeriodEnd: new Date(Date.now() + 30*24*3600*1000) },
      create: { workspaceId, plan, status: "active", currentPeriodEnd: new Date(Date.now() + 30*24*3600*1000) },
    });

    logger.info('Subscription updated', { workspaceId, plan });

    return NextResponse.json({ url: "/billing/success" });
  } catch (error) {
    return handleApiError(error);
  }
}
