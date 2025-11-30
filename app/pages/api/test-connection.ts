import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const diagnostics: any = {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlFormat: "unknown",
    keyFormat: "unknown",
    connectionTest: "not attempted",
  };

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: "Missing environment variables",
      diagnostics,
    });
  }

  // Normalize URL
  supabaseUrl = supabaseUrl.trim().replace(/\/$/, "");

  // Check URL format
  if (supabaseUrl.startsWith("https://") && supabaseUrl.includes(".supabase.co")) {
    diagnostics.urlFormat = "valid";
    diagnostics.urlPreview = supabaseUrl.substring(0, 40) + "...";
  } else {
    diagnostics.urlFormat = "invalid";
    diagnostics.urlValue = supabaseUrl;
  }

  // Check key format
  if (supabaseKey.startsWith("eyJ")) {
    diagnostics.keyFormat = "valid";
    diagnostics.keyPreview = supabaseKey.substring(0, 20) + "...";
  } else {
    diagnostics.keyFormat = "invalid";
    diagnostics.keyPreview = supabaseKey.substring(0, 20) + "...";
  }

  // Test direct URL reachability first
  try {
    const testUrl = `${supabaseUrl}/rest/v1/`;
    console.log("Testing direct URL reachability:", testUrl);
    const directTest = await fetch(testUrl, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });
    diagnostics.directUrlTest = {
      status: directTest.status,
      statusText: directTest.statusText,
      reachable: directTest.status < 500,
    };
  } catch (directError: any) {
    diagnostics.directUrlTest = {
      error: directError.message,
      code: directError.code,
      name: directError.name,
      reachable: false,
    };
    console.error("Direct URL test failed:", directError);
  }

  // Test connection with Supabase client
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase.from("messages").select("id").limit(1);

    if (error) {
      diagnostics.connectionTest = "failed";
      diagnostics.error = error.message;
      diagnostics.errorCode = error.code;
      diagnostics.errorDetails = error.details;
      diagnostics.errorHint = error.hint;

      return res.status(500).json({
        error: "Connection test failed",
        diagnostics,
      });
    }

    diagnostics.connectionTest = "success";
    diagnostics.tableExists = true;
    diagnostics.messageCount = data?.length ?? 0;

    return res.status(200).json({
      success: true,
      message: "Successfully connected to Supabase",
      diagnostics,
    });
  } catch (err: any) {
    diagnostics.connectionTest = "error";
    diagnostics.error = err.message;
    diagnostics.errorStack = err.stack;

    return res.status(500).json({
      error: "Network error during connection test",
      diagnostics,
    });
  }
}

