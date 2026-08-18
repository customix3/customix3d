# Firebase Firestore setup (required for multi-device sync)

Products & orders are stored in **Firestore**. Without publishing rules, you will see permission errors and data will not sync.

## 1. Open Firebase Console

1. Go to https://console.firebase.google.com/
2. Select project **customix3d-123**
3. Left menu → **Build** → **Firestore Database**
4. If not created: **Create database** → start in **production mode** → choose a region (e.g. asia-south1)

## 2. Publish rules

1. Open the **Rules** tab
2. Replace everything with the contents of `firestore.rules` in this repo (or paste below)
3. Click **Publish**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if true;
    }
    match /orders/{orderId} {
      allow read: if true;
      allow create, update: if true;
      allow delete: if false;
    }
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

(Temporary open rules so admin works without Firebase Auth. Lock down later.)

## 3. Test

1. Hard refresh the site
2. Admin → Products → **Add product**
3. Open the same site on another phone/PC → product should appear

## Collections used

| Collection | Purpose |
|------------|---------|
| `products` | Catalog (admin CRUD) |
| `orders`   | Checkout after Razorpay |
