import { supabase } from './supabase';

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name (e.g., 'product-images')
 * @param path - Path within bucket (e.g., 'products/ring-001.jpg')
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  bucket: string = 'product-images',
  path?: string
): Promise<string> {
  if (!supabase) throw new Error('Supabase not initialized');

  const fileName = path || `${Date.now()}-${file.name}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload product image
 * @param file - Image file
 * @param productSku - Product SKU for organization
 * @returns Public URL
 */
export async function uploadProductImage(
  file: File,
  productSku: string
): Promise<string> {
  const path = `products/${productSku}/${Date.now()}-${file.name}`;
  return uploadFile(file, 'product-images', path);
}

/**
 * Upload review image
 * @param file - Image file
 * @param reviewId - Review ID
 * @returns Public URL
 */
export async function uploadReviewImage(
  file: File,
  reviewId: string
): Promise<string> {
  const path = `reviews/${reviewId}/${Date.now()}-${file.name}`;
  return uploadFile(file, 'review-images', path);
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - Storage bucket name
 * @param path - Path to file
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<void> {
  if (!supabase) throw new Error('Supabase not initialized');

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Get signed URL (for private files, expires in 1 hour)
 * @param bucket - Storage bucket name
 * @param path - Path to file
 */
export async function getSignedUrl(
  bucket: string,
  path: string
): Promise<string> {
  if (!supabase) throw new Error('Supabase not initialized');

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600); // 1 hour

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}
