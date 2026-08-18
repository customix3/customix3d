# CustoMix3D Admin

## Login
- URL: `/admin/login`
- Demo: `admin` / `admin123` (localStorage session)

## Products
- **Add / Edit / Delete** from `/admin/products`
- Catalog is stored in browser localStorage (`customix3d-products`)
- Storefront reads the same list (active products only)

## Orders
- Appear after successful Razorpay checkout
- Update status from `/admin/orders`

## Razorpay TEST
- Key ID used in frontend: `rzp_test_TRAqhKGvLnsCHg`
- **Key secret must never be put in frontend code**
- Keep secret only for future server-side signature verification / refunds
- Test cards: https://razorpay.com/docs/payments/payments/test-card-upi-details/

## Next
- Nimbus Post courier API
- Firestore sync for products/orders across devices
