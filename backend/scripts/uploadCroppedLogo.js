import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCroppedLogo() {
  try {
    const imagePath = path.join(
      __dirname,
      "../frontend/assets/Meyaar jewellers transparent logo.png"
    );

    if (!fs.existsSync(imagePath)) {
      console.error(`File not found: ${imagePath}`);
      process.exit(1);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = "Meyaar-jewellers-transparent-logo.png";

    console.log(`Uploading ${fileName} to Supabase Storage...`);

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageBuffer, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      process.exit(1);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(fileName);

    console.log(`✅ Successfully uploaded: ${fileName}`);
    console.log(`📍 Public URL: ${publicUrl}`);

    // Store in branding table
    const { error: dbError } = await supabase.from("branding").upsert(
      {
        id: 1,
        company_name: "Meyaar Jewellers",
        logo_transparent_url: publicUrl,
        updated_at: new Date(),
      },
      { onConflict: "id" }
    );

    if (dbError) {
      console.error("Database error:", dbError);
      process.exit(1);
    }

    console.log("✅ Logo URL saved to database");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

uploadCroppedLogo();
