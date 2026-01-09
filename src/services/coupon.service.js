import Coupon from "../models/Coupon.js";

export const validateCoupon = async ({ code, orderAmount }) => {
  const coupon = await Coupon.findOne({
    code,
    isActive: true,
    expiresAt: { $gt: new Date() }
  });

  if (!coupon) {
    throw new Error("Invalid or expired coupon");
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (orderAmount < coupon.minOrderAmount) {
    throw new Error(
      `Minimum purchase of ₹${coupon.minOrderAmount} required`
    );
  }

  let discountAmount = 0;

  if (coupon.discountType === "PERCENT") {
    discountAmount = (orderAmount * coupon.discountValue) / 100;

    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  }

  if (coupon.discountType === "FLAT") {
    discountAmount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);

  return {
    discountAmount,
    coupon
  };
};
