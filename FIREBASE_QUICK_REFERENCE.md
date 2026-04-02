# Firebase Quick Reference

## Authentication

```typescript
// Sign Up
import { useSignUp } from '@/hooks/useFirebaseAuth';
const { signUp, loading, error } = useSignUp();
await signUp(email, password, displayName);

// Sign In
import { useSignIn } from '@/hooks/useFirebaseAuth';
const { signIn, loading, error } = useSignIn();
await signIn(email, password);

// Get Current User
import { useAuth } from '@/contexts/AuthContext';
const { user, loading, signOut } = useAuth();

// Check if User Logged In
if (user) {
  // User is logged in
}
```

## Products

```typescript
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/firebaseService';

// Get all products
const products = await getProducts();

// Get products by category
const necklaces = await getProductsByCategory('necklaces');

// Get single product
const product = await getProductById(productId);

// Create product
const id = await createProduct({
  name: 'Diamond Necklace',
  category: 'necklaces',
  description: '...',
  price: 9999,
  image: 'url...',
  stock: 10,
});

// Update product
await updateProduct(id, { price: 8999 });

// Delete product
await deleteProduct(id);
```

## Image Upload

```typescript
import {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
  getFileURL,
} from '@/lib/firebaseStorage';

// Upload single image
const imageUrl = await uploadProductImage(file, productId);

// Upload multiple images
const imageUrls = await uploadProductImages(files, productId);

// Delete image
await deleteProductImage(productId, imageName);

// Get download URL
const url = await getFileURL(path);
```

## User Profile

```typescript
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from '@/lib/firebaseService';

// Get profile
const profile = await getUserProfile(uid);

// Create profile
await createUserProfile({
  uid: user.uid,
  email: user.email,
  displayName: 'John Doe',
});

// Update profile
await updateUserProfile(uid, {
  phone: '+1234567890',
  address: '123 Main St',
});
```

## Orders

```typescript
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '@/lib/firebaseService';

// Get all orders for user
const orders = await getOrders(userId);

// Get single order
const order = await getOrderById(orderId);

// Create order
const orderId = await createOrder({
  userId: user.uid,
  items: [{ productId: '...', quantity: 2, price: 100 }],
  totalPrice: 200,
  status: 'pending',
});

// Update order status
await updateOrder(orderId, { status: 'shipped' });

// Delete order
await deleteOrder(orderId);
```

## Common Patterns

### Protected Component
```tsx
function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.email}</div>;
}
```

### Load Products on Mount
```tsx
useEffect(() => {
  getProductsByCategory('necklaces').then(setProducts);
}, []);
```

### Handle Async Operations
```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleAction = async () => {
  setLoading(true);
  setError(null);
  try {
    await someFirebaseOperation();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

## Firestore Constraints

```typescript
import { where } from 'firebase/firestore';
import { getProducts } from '@/lib/firebaseService';

// Get products with constraints
const products = await getProducts([
  where('category', '==', 'necklaces'),
]);

// Available operators:
// == (equals)
// < (less than)
// <= (less than or equal)
// > (greater than)
// >= (greater than or equal)
// != (not equal)
// in (in array)
// array-contains (contains value)
```

## Error Handling

```typescript
try {
  const user = await signUp(email, password, name);
} catch (error: any) {
  if (error.code === 'auth/email-already-in-use') {
    console.log('Email already registered');
  } else if (error.code === 'auth/weak-password') {
    console.log('Password too weak');
  }
}
```

## Environment Variables

Required in `.env.local`:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```
