import { supabase, authAvailable } from './supabase';

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
  createdAt?: string;
  updatedAt?: string;
}

// Guest Order type
export interface GuestOrder extends Omit<Order, 'userId'> {
  guestEmail: string;
  guestName: string;
  userId?: undefined;
}

// ============ Order Operations ============

export async function createOrder(order: Order) {
  try {
    if (!authAvailable || !supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: order.userId,
          items: order.items,
          total_price: order.totalPrice,
          status: order.status,
          shipping_address: order.shippingAddress,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data?.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function createGuestOrder(order: GuestOrder) {
  try {
    if (!authAvailable || !supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('guest_orders')
      .insert([
        {
          guest_name: order.guestName,
          guest_email: order.guestEmail,
          items: order.items,
          total_price: order.totalPrice,
          status: order.status,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data?.id;
  } catch (error) {
    console.error('Error creating guest order:', error);
    throw error;
  }
}

export async function getOrders(userId: string) {
  try {
    if (!authAvailable || !supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string) {
  try {
    if (!authAvailable || !supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function updateOrder(orderId: string, updates: Partial<Order>) {
  try {
    if (!authAvailable || !supabase) {
      throw new Error('Supabase not available');
    }

    const updateData: Record<string, any> = {};
    
    if (updates.status) updateData.status = updates.status;
    if (updates.totalPrice) updateData.total_price = updates.totalPrice;
    if (updates.shippingAddress) updateData.shipping_address = updates.shippingAddress;
    if (updates.items) updateData.items = updates.items;

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

export async function getGuestOrder(orderId: string) {
  try {
    if (!authAvailable || !supabase) {
      throw new Error('Supabase not available');
    }

    const { data, error } = await supabase
      .from('guest_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching guest order:', error);
    throw error;
  }
}
