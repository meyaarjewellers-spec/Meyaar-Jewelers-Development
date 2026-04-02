import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './firebase';

// Upload a file to Firebase Storage
export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  try {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Upload product image
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const timestamp = Date.now();
  const path = `products/${productId}/${timestamp}-${file.name}`;
  return uploadFile(file, path);
}

// Upload multiple product images
export async function uploadProductImages(
  files: File[],
  productId: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) =>
      uploadProductImage(file, productId)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
}

// List files in a directory
export async function listFiles(path: string): Promise<string[]> {
  try {
    const dirRef = ref(storage, path);
    const result = await listAll(dirRef);
    const urls = await Promise.all(
      result.items.map((item) => getDownloadURL(item))
    );
    return urls;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Delete a file from Storage
export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// Delete product images
export async function deleteProductImage(
  productId: string,
  imagePath: string
): Promise<void> {
  try {
    const path = `products/${productId}/${imagePath}`;
    await deleteFile(path);
  } catch (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
}

// Get download URL for a file
export async function getFileURL(path: string): Promise<string> {
  try {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}
