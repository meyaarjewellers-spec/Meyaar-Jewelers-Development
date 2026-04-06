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
      logo_with_bg_url: 'https://via.placeholder.com/200?text=Logo',
      logo_transparent_url: 'https://via.placeholder.com/200?text=Transparent',
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
    // Also store the exceptional service icon
    await storeExceptionalServiceIcon();
  } catch (error) {
    console.error('Error initializing branding:', error);
  }
}

/**
 * Store the Exceptional Service icon SVG in the database
 */
export async function storeExceptionalServiceIcon() {
  const adminClient = getAdminClient();
  
  const iconSvg = `<svg viewBox="0 -1 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.31 16.826C12.2864 17.9963 11.3464 18.9278 10.2052 18.9118C9.06401 18.8957 8.14927 17.9382 8.15697 16.7676C8.16467 15.5971 9.09191 14.6522 10.2332 14.652C10.7897 14.6578 11.3212 14.8901 11.7106 15.2978C12.1001 15.7055 12.3157 16.2552 12.31 16.826V16.826Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2014 16.826C22.1778 17.9963 21.2378 18.9278 20.0966 18.9118C18.9554 18.8957 18.0407 17.9382 18.0484 16.7676C18.0561 15.5971 18.9833 14.6522 20.1246 14.652C20.6811 14.6578 21.2126 14.8901 21.602 15.2978C21.9915 15.7055 22.2071 16.2552 22.2014 16.826V16.826Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17.0571 11.559H18.5571M18.5571 16.826V11.559H17.0571V16.826H18.5571ZM22.189 16.0762L24.2224 9.08937C24.2675 8.43728 23.976 7.642 23.4204 7.05042L22.327 8.07731C22.6025 8.37065 22.7519 8.7712 22.7342 9.18603L23.4835 9.218M17.8031 6.127V7.627H21.2849C21.6768 7.62448 22.0522 7.7847 22.327 8.07731M17.8031 12.309H23.893M6.382 6.075V15.75M7.42037 5H16.7657M1 7.75H4.05175M1.975 10.75H3.925M2.56975 13.75H3.925" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  try {
    const { error } = await adminClient
      .from('branding')
      .update({
        exceptional_service_icon: iconSvg,
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error && !error.message.includes('0 rows')) {
      console.warn('Could not update icon in branding table:', error);
    }
  } catch (error) {
    console.warn('Error storing exceptional service icon:', error);
  }
}
