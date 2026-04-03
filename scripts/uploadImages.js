#!/usr/bin/env node

/**
 * Upload all images from assets folder to Supabase Storage
 * Run with: node scripts/uploadImages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from client/.env.local
const envPath = path.join(__dirname, '../client/.env.local');
dotenv.config({ path: envPath });

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Path to assets folder
const assetsPath = path.join(__dirname, '../client/src/assets');

async function uploadImages() {
  try {
    console.log('📸 Starting image upload to Supabase Storage...\n');

    // Create storage bucket if it doesn't exist
    const bucketName = 'product-images';

    // Try to create the bucket (it's ok if it already exists)
    try {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });
      console.log(`✅ Created bucket: ${bucketName}\n`);
    } catch (e) {
      if (!e.message.includes('already exists')) {
        console.log(`⚠️  Bucket ${bucketName} may already exist or error: ${e.message}\n`);
      }
    }

    // Read all JPG files from assets
    const files = fs.readdirSync(assetsPath).filter((file) => file.endsWith('.jpg'));

    if (files.length === 0) {
      console.error('❌ No JPG files found in assets folder');
      process.exit(1);
    }

    const imageUrls = {};
    let uploadCount = 0;

    console.log(`Found ${files.length} images to upload:\n`);

    for (const file of files) {
      const filePath = path.join(assetsPath, file);
      const fileBuffer = fs.readFileSync(filePath);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`products/${file}`, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true, // Overwrite if exists
        });

      if (error) {
        console.warn(`⚠️  ${file}: ${error.message}`);
        continue;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`products/${file}`);

      imageUrls[file] = publicData.publicUrl;
      uploadCount++;

      console.log(`✅ ${file}`);
      console.log(`   URL: ${publicData.publicUrl}\n`);
    }

    // Save URLs to a JSON file for reference
    const outputPath = path.join(__dirname, '../imageUrls.json');
    fs.writeFileSync(outputPath, JSON.stringify(imageUrls, null, 2));

    console.log(`\n✨ Successfully uploaded ${uploadCount}/${files.length} images`);
    console.log(`📝 Image URLs saved to: imageUrls.json\n`);

    // Print summary
    console.log('Image Mapping for seedDatabase:');
    console.log('================================\n');
    files.forEach((file, index) => {
      if (imageUrls[file]) {
        console.log(`Image ${index + 1}: ${file}`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    process.exit(1);
  }
}

uploadImages();
