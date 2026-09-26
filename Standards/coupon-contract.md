# Coupon / Promo Runtime Contract (Conditional)

Load ONLY when a campaign includes a promotion, coupon, or discount offer.
Normal Weekly / Category / Educational campaigns do NOT use coupons by default.
Component: `Components/coupon.html`.

---

## When to load this contract

- Content Calendar explicitly defines a promotion/coupon
- Campaign Brief explicitly requires one
- Management explicitly approves/requests it (e.g. Black Friday, EOFY)

## Rules

1. **Never invent a coupon code.** If the real code has not been provided, use a clearly-marked
   placeholder for the code while writing appropriate promo copy.
2. **Coupon codes must be verified** created and active in the relevant commerce platform (BigCommerce)
   before send.
3. **Promo title/heading is campaign-specific.** Never reuse a previous campaign's promo title.
   Generate a unique title aligned with the current campaign theme.
4. **SC-specific:** Standard SC coupon = "$20 off orders over $200" (fixed-dollar). No percentage
   discounts for SC unless a special arrangement explicitly requires it.
5. **Promo section is part of the campaign story**, not a generic discount block. Title, heading,
   CTA, and supporting copy match the campaign theme.

## Absent coupon

When no promotion exists for a campaign:
- Do NOT render `Components/coupon.html`
- Do NOT leave empty promo containers or unresolved `[[COUPON_*]]` tokens
- Remove the complete coupon HTML block cleanly
