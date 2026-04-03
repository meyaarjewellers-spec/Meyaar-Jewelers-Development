#!/usr/bin/env node

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, "../client/.env.local") });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("\n❌ Error: Missing SUPABASE_SERVICE_ROLE_KEY");
  console.error("\n📝 Setup Instructions:");
  console.error("  1. Go to https://app.supabase.com");
  console.error("  2. Select your project (voglupvbegeoowawwsck)");
  console.error("  3. Click Settings → API → Reveal service_role secret");
  console.error("  4. Copy the 'service_role' key (the long one)");
  console.error("  5. Add to client/.env.local:");
  console.error("     SUPABASE_SERVICE_ROLE_KEY=<your_key_here>\n");
  process.exit(1);
}

async function deploySchema() {
  console.log("\n🚀 Deploying Meyaar Jewelers Database Schema\n");
  console.log("Supabase Project:", SUPABASE_URL);

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, "../schema.sql");
    if (!fs.existsSync(schemaPath)) {
      console.error("❌ Error: schema.sql not found");
      process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Clean up schema for deployment
    const cleanedSchema = schema
      .split("\n")
      .filter((line) => !line.trim().startsWith("--")) // Remove comments
      .join("\n")
      .replace(/\/\*[\s\S]*?\*\//g, ""); // Remove block comments

    // Extract project reference from URL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];
    if (!projectRef) {
      console.error("❌ Invalid Supabase URL");
      process.exit(1);
    }

    // Use Supabase Management API
    const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

    console.log("📤 Sending schema to Supabase...\n");

    const response = await makeRequest(managementApiUrl, {
      query: cleanedSchema,
    });

    console.log("✅ Schema deployed successfully!\n");
    console.log("📊 Tables created:");
    console.log("  ✓ users");
    console.log("  ✓ user_profiles");
    console.log("  ✓ user_roles");
    console.log("  ✓ addresses");
    console.log("  ✓ categories");
    console.log("  ✓ products");
    console.log("  ✓ product_variants");
    console.log("  ✓ product_inventory");
    console.log("  ✓ product_images");
    console.log("  ✓ reviews");
    console.log("  ✓ review_images");
    console.log("  ✓ review_votes");
    console.log("  ✓ carts");
    console.log("  ✓ cart_items");
    console.log("  ✓ orders");
    console.log("  ✓ order_items");
    console.log("  ✓ order_status_history");
    console.log("  ✓ payments");
    console.log("  ✓ refunds");
    console.log("  ✓ shipments");
    console.log("  ✓ coupon_codes");
    console.log("  ✓ wishlists");
    console.log("  ✓ wishlist_items\n");
    console.log("🎉 Database is ready to use!\n");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("  • Verify service_role key is correct");
    console.error("  • Check that your Supabase project is active");
    console.error("  • Ensure you're using the SERVICE_ROLE key, not the anon key\n");
    process.exit(1);
  }
}

function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    };

    const req = https.request(url, options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(responseData));
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${responseData}`)
            );
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

await deploySchema();
