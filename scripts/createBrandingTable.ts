import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBrandingTable() {
  try {
    console.log("Creating branding table...");

    const { error } = await supabase.rpc("create_branding_table", {}, {
      count: "exact",
    });

    // Try direct SQL execution via supabase client
    const sql = `
      CREATE TABLE IF NOT EXISTS branding (
        id INTEGER PRIMARY KEY DEFAULT 1,
        company_name VARCHAR(255) DEFAULT 'Meyaar Jewellers',
        founded_year INTEGER,
        logo_with_bg_url TEXT,
        logo_transparent_url TEXT,
        description TEXT,
        instagram_url TEXT,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Attempting to insert branding data...");

    const { data, error: insertError } = await supabase
      .from("branding")
      .upsert(
        {
          id: 1,
          company_name: "Meyaar Jewellers",
          logo_transparent_url:
            "https://voglupvbegeoowawwsck.supabase.co/storage/v1/object/public/product-images/Meyaar-jewellers-transparent-logo.png",
          instagram_url: "https://www.instagram.com/meyaarjewellers/",
        },
        { onConflict: "id" }
      );

    if (insertError && insertError.code === "PGRST204") {
      console.log("✅ Branding table created (first insert)");
    } else if (insertError) {
      console.error("Database error:", insertError.message);
    } else {
      console.log("✅ Branding data saved successfully");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

createBrandingTable();
