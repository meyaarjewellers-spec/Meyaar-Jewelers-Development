import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryConstraint,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// Product type
export interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  stock: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// User profile type
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Order type
export interface Order {
  id?: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ============ Product Operations ============

export async function getProducts(constraints: QueryConstraint[] = []) {
  try {
    const q = query(collection(db, 'products'), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Product & { id: string }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductsByCategory(category: string) {
  try {
    return await getProducts([where('category', '==', category)]);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product & { id: string };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createProduct(product: Product) {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// ============ User Profile Operations ============

export async function getUserProfile(uid: string) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function createUserProfile(profile: UserProfile) {
  try {
    const docRef = doc(db, 'users', profile.uid);
    await updateDoc(docRef, {
      ...profile,
      updatedAt: Timestamp.now(),
    }).catch(() => {
      // If doc doesn't exist, create it
      return updateDoc(doc(db, 'users', profile.uid), {
        ...profile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    // Create a new document if it doesn't exist
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        ...profile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } catch {
      // Final fallback - just log it
    }
  }
}

export async function createOrUpdateUserProfile(profile: Partial<UserProfile> & { uid: string; email: string }) {
  try {
    const userRef = doc(db, 'users', profile.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...profile,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new profile
      await updateDoc(userRef, {
        ...profile,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error);
    // Non-critical error, don't throw
  }
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// ============ Guest Order Operations ============

export interface GuestOrder extends Omit<Order, 'userId'> {
  guestEmail: string;
  guestName: string;
  userId?: undefined;
}

export async function createGuestOrder(order: GuestOrder) {
  try {
    const docRef = await addDoc(collection(db, 'guest_orders'), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating guest order:', error);
    throw error;
  }
}

export async function getGuestOrder(orderId: string) {
  try {
    const docRef = doc(db, 'guest_orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as GuestOrder & { id: string };
    }
    return null;
  } catch (error) {
    console.error('Error fetching guest order:', error);
    throw error;
  }
}

// ============ Order Operations ============

export async function getOrders(userId: string) {
  try {
    return await getDocs(
      query(collection(db, 'orders'), where('userId', '==', userId))
    ).then((snapshot) =>
      snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Order & { id: string })
      )
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string) {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order & { id: string };
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function createOrder(order: Order) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}
