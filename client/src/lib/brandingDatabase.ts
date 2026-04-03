import { createClient } from '@supabase/supabase-js';

// Create admin client for branding operations
function getAdminClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return createClient(supabaseUrl!, supabaseKey!);
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

/**
 * Store branding information including logos in Supabase
 */
export async function storeBrandingInfo() {
  const adminClient = getAdminClient();
  
  try {
    // Convert local image files to URLs (these would be uploaded to Supabase Storage in production)
    const brandingData = {
      company_name: 'Meyaar Jewellers',
      founded_year: 2025,
      logo_with_bg_url: 'local:/assets/1 (1)_1763434109602.png',
      logo_transparent_url: 'local:/assets/Meyaar jewelrs transparent logo.png',
      description: 'Handcrafted artisan jewelry with Pakistani heritage, made in the USA',
      instagram_url: 'https://www.instagram.com/meyaarjewellers/',
      email: 'hello@meyaarjewellers.com',
      last_updated: new Date().toISOString(),
    };

    // Check if branding record exists
    const { data: existing } = await adminClient
      .from('branding')
      .select('*')
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing record
      const { error } = await adminClient
        .from('branding')
        .update(brandingData)
        .eq('id', existing[0].id);
      
      if (error) throw error;
      return { success: true, message: 'Branding info updated' };
    } else {
      // Insert new record
      const { error } = await adminClient
        .from('branding')
        .insert([brandingData]);
      
      if (error) throw error;
      return { success: true, message: 'Branding info stored' };
    }
  } catch (error) {
    console.error('Error storing branding info:', error);
    throw error;
  }
}

/**
 * Fetch branding information from Supabase
 */
export async function getBrandingInfo() {
  const adminClient = getAdminClient();
  
  try {
    const { data, error } = await adminClient
      .from('branding')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching branding info:', error);
    return null;
  }
}

/**
 * Initialize branding data on first load
 */
export async function initializeBranding() {
  try {
    const existing = await getBrandingInfo();
    if (!existing) {
      await storeBrandingInfo();
    }
  } catch (error) {
    console.error('Error initializing branding:', error);
  }
}
