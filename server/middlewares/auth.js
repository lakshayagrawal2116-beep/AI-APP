import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    // Clerk Billing check
    const hasPremiumPlan = await has({ plan: "premium" });

    const user = await clerkClient.users.getUser(userId);

    // ---- FREE USAGE LOGIC ----
    const freeUsage = user.publicMetadata?.free_usage ?? 0;

    req.free_usage = freeUsage;

    // ---- PLAN ----
    req.plan = hasPremiumPlan ? "premium" : "free";

    // ---- SYNC PUBLIC METADATA (ONLY IF NEEDED) ----
    if (
      hasPremiumPlan &&
      user.publicMetadata?.plan !== "premium"
    ) {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          plan: "premium",
        },
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
