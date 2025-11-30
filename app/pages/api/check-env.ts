import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Safely show URL info without exposing sensitive data
  const urlInfo = {
    isSet: !!supabaseUrl,
    length: supabaseUrl?.length || 0,
    startsWithHttps: supabaseUrl?.startsWith("https://") || false,
    containsSupabase: supabaseUrl?.includes(".supabase.co") || false,
    firstChars: supabaseUrl?.substring(0, 30) || "not set",
    lastChars: supabaseUrl?.substring(Math.max(0, (supabaseUrl?.length || 0) - 20)) || "not set",
    // Check for common issues
    hasTrailingSlash: supabaseUrl?.endsWith("/") || false,
    hasDoubleSlash: supabaseUrl?.includes("//") && supabaseUrl.split("//").length > 2,
    // Show character analysis
    characterCount: {
      dots: (supabaseUrl?.match(/\./g) || []).length,
      slashes: (supabaseUrl?.match(/\//g) || []).length,
    },
  };
  
  // Try to parse as URL to see what happens
  let parsedUrl = null;
  if (supabaseUrl) {
    try {
      const testUrl = supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`;
      parsedUrl = new URL(testUrl);
    } catch (error: any) {
      parsedUrl = { error: error.message };
    }
  }
  
  return res.status(200).json({
    supabaseUrl: urlInfo,
    hasServiceRoleKey: hasKey,
    parsedUrl: parsedUrl,
    recommendation: !supabaseUrl 
      ? "Set SUPABASE_URL in .env.local"
      : !supabaseUrl.startsWith("https://")
      ? "URL must start with https://"
      : supabaseUrl.endsWith("/")
      ? "Remove trailing slash from URL"
      : "URL format looks correct",
  });
}


