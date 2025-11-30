import type { NextApiRequest, NextApiResponse } from "next";
import https from "https";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let supabaseUrl = process.env.SUPABASE_URL;
  
  if (!supabaseUrl) {
    return res.status(500).json({ error: "SUPABASE_URL not set" });
  }

  // Normalize URL - remove trailing slash
  supabaseUrl = supabaseUrl.trim().replace(/\/$/, "");
  
  // Log the actual URL for debugging
  console.log("Raw SUPABASE_URL:", supabaseUrl);
  
  // Ensure URL is properly formatted
  if (!supabaseUrl.startsWith("https://")) {
    return res.status(500).json({ 
      error: "Invalid SUPABASE_URL format",
      url: supabaseUrl,
      message: "URL must start with https://"
    });
  }

  let url: URL;
  try {
    url = new URL(`${supabaseUrl}/rest/v1/`);
    console.log("Parsed URL hostname:", url.hostname);
  } catch (urlError: any) {
    return res.status(500).json({
      error: "Failed to parse URL",
      url: supabaseUrl,
      errorMessage: urlError.message,
    });
  }
  
  return new Promise<void>((resolve) => {
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: "HEAD",
      headers: {
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      },
    };

    const req = https.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        res.status(200).json({
          success: true,
          message: "HTTPS connection successful using Node.js https module",
          statusCode: response.statusCode,
          headers: response.headers,
        });
        resolve();
      });
    });

    req.on("error", (error: any) => {
      res.status(500).json({
        error: "HTTPS request failed",
        message: error.message,
        code: error.code,
        details: "This confirms it's a Node.js SSL/network issue, not a Supabase client issue",
      });
      resolve();
    });

    req.end();
  });
}

