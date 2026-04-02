# Firebase Integration Guide for Meyaar Jewellers

This guide explains how to use Firebase in your Meyaar Jewellers e-commerce application for authentication and product catalog management.

## Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: "Meyaar Jewellers"
4. Accept the terms and create the project
5. Once created, click "Add app" and select "Web"
6. Register the app and copy the Firebase config

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### 3. Enable Services in Firebase Console

#### Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. Enable any additional providers (Google, etc.)

#### Firestore Database
1. Go to Firestore Database
2. Create database in production mode
3. Set collection rules to allow authenticated users

#### Storage
1. Go to Storage
2. Create bucket
3. Allow authenticated users to read/write

## File Structure

```
client/src/
├── lib/
│   ├── firebase.ts              # Firebase initialization
│   ├── firebaseService.ts       # Firestore operations (products, users, orders)
│   ├── firebaseStorage.ts       # File upload/download operations
│
├── contexts/
│   └── AuthContext.tsx          # Auth state provider
│
├── hooks/
│   └── useFirebaseAuth.ts       # Auth hooks (signUp, signIn, resetPassword)
│
└── pages/
    ├── SignIn.tsx               # Sign in page
    └── SignUp.tsx               # Sign up page
```

## Usage Examples

### Authentication

#### Sign Up
```tsx
import { useSignUp } from '@/hooks/useFirebaseAuth';

function SignUpForm() {
  const { signUp, loading, error } = useSignUp();

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      const user = await signUp(email, password, name);
      console.log('Account created:', user);
    } catch (err) {
      console.error('Sign up failed:', err);
    }
  };

  return (
    // Your form JSX
  );
}
```

#### Sign In
```tsx
import { useSignIn } from '@/hooks/useFirebaseAuth';

function SignInForm() {
  const { signIn, loading, error } = useSignIn();

  const handleSignIn = async (email: string, password: string) => {
    try {
      const user = await signIn(email, password);
      console.log('Signed in:', user);
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  return (
    // Your form JSX
  );
}
```

#### Get Current User
```tsx
import { useAuth } from '@/contexts/AuthContext';

function UserProfile() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Product Catalog

#### Get All Products
```tsx
import { getProducts } from '@/lib/firebaseService';

async function loadProducts() {
  try {
    const products = await getProducts();
    console.log('Products:', products);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}
```

#### Get Products by Category
```tsx
import { getProductsByCategory } from '@/lib/firebaseService';

async function loadNecklaces() {
  try {
    const necklaces = await getProductsByCategory('necklaces');
    console.log('Necklaces:', necklaces);
  } catch (err) {
    console.error('Failed to load necklaces:', err);
  }
}
```

#### Get Single Product
```tsx
import { getProductById } from '@/lib/firebaseService';

async function loadProduct(productId: string) {
  try {
    const product = await getProductById(productId);
    console.log('Product:', product);
  } catch (err) {
    console.error('Failed to load product:', err);
  }
}
```

#### Create Product (Admin)
```tsx
import { createProduct, uploadProductImage } from '@/lib/firebaseService';
import { uploadProductImage } from '@/lib/firebaseStorage';

async function addProduct(productData: any, imageFile: File) {
  try {
    // Upload image first
    const imageUrl = await uploadProductImage(imageFile, 'temp-id');

    // Create product
    const productId = await createProduct({
      name: productData.name,
      category: productData.category,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      image: imageUrl,
    });

    console.log('Product created:', productId);
  } catch (err) {
    console.error('Failed to create product:', err);
  }
}
```

#### Update Product (Admin)
```tsx
import { updateProduct } from '@/lib/firebaseService';

async function updateProductInfo(productId: string, updates: any) {
  try {
    await updateProduct(productId, updates);
    console.log('Product updated');
  } catch (err) {
    console.error('Failed to update product:', err);
  }
}
```

### File Upload

#### Upload Product Images
```tsx
import { uploadProductImages } from '@/lib/firebaseStorage';

async function uploadImages(files: File[], productId: string) {
  try {
    const urls = await uploadProductImages(files, productId);
    console.log('Uploaded images:', urls);
  } catch (err) {
    console.error('Upload failed:', err);
  }
}
```

#### Delete Image
```tsx
import { deleteProductImage } from '@/lib/firebaseStorage';

async function removeImage(productId: string, imageName: string) {
  try {
    await deleteProductImage(productId, imageName);
    console.log('Image deleted');
  } catch (err) {
    console.error('Delete failed:', err);
  }
}
```

### User Profiles

#### Get User Profile
```tsx
import { getUserProfile } from '@/lib/firebaseService';
import { useAuth } from '@/contexts/AuthContext';

function UserInfo() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setProfile);
    }
  }, [user]);

  return (
    // Display profile
  );
}
```

#### Update User Profile
```tsx
import { updateUserProfile } from '@/lib/firebaseService';
import { useAuth } from '@/contexts/AuthContext';

async function updateProfile(updates: any) {
  const { user } = useAuth();
  if (user) {
    await updateUserProfile(user.uid, updates);
  }
}
```

### Orders

#### Create Order
```tsx
import { createOrder } from '@/lib/firebaseService';
import { useAuth } from '@/contexts/AuthContext';

async function placeOrder(items: any[], totalPrice: number) {
  const { user } = useAuth();
  if (user) {
    const orderId = await createOrder({
      userId: user.uid,
      items,
      totalPrice,
      status: 'pending',
    });
    return orderId;
  }
}
```

#### Get Orders
```tsx
import { getOrders } from '@/lib/firebaseService';
import { useAuth } from '@/contexts/AuthContext';

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      getOrders(user.uid).then(setOrders);
    }
  }, [user]);

  return (
    // Display orders
  );
}
```

## Firestore Collection Structure

### Products Collection
```
/products/{productId}
{
  name: string
  category: string
  description: string
  price: number
  image: string
  images: string[] (optional)
  stock: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Users Collection
```
/users/{uid}
{
  uid: string
  email: string
  displayName: string
  phone: string (optional)
  address: string (optional)
  city: string (optional)
  country: string (optional)
  zipCode: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Orders Collection
```
/orders/{orderId}
{
  userId: string
  items: [{
    productId: string
    quantity: number
    price: number
  }]
  totalPrice: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  shippingAddress: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Firestore Security Rules

Set these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to products
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Authenticated users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only read/write their own orders
    match /orders/{document=**} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
  }
}
```

## Storage Security Rules

Set these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read for product images
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Next Steps

1. **Add admin panel** for managing products and uploads
2. **Integrate payment processing** (Stripe/PayPal)
3. **Set up email notifications** for orders
4. **Create review/rating system**
5. **Implement wishlist feature**
6. **Add order tracking**

## Troubleshooting

### "VITE_FIREBASE_* is undefined"
- Make sure `.env.local` exists with correct values
- Restart dev server after changing env variables
- Use `import.meta.env.VITE_*` to access variables

### "User not authenticated"
- Check Firestore Security Rules
- Verify Authentication is enabled in Firebase Console
- Ensure user is signed in before accessing protected features

### "File upload fails"
- Check Storage Security Rules
- Verify Storage bucket is created
- Check file size limits

## Support

For more information:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Storage](https://firebase.google.com/docs/storage)
