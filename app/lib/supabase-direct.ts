// Direct Supabase REST API client using Node.js https module
// This is a workaround for Node.js fetch SSL issues on Windows
import https from "https";

const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "") || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

interface SupabaseError {
  message: string;
  code?: string;
  details?: unknown;
}

interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}

export async function supabaseQuery<T = unknown>(
  table: string,
  options: {
    select?: string;
    eq?: { [key: string]: unknown };
    order?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}
): Promise<SupabaseResponse<T[]>> {
  return new Promise((resolve) => {
    const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
    
    // Add query parameters
    if (options.select) {
      url.searchParams.set("select", options.select);
    }
    if (options.limit) {
      url.searchParams.set("limit", options.limit.toString());
    }
    if (options.order) {
      url.searchParams.set("order", `${options.order.column}.${options.order.ascending ? "asc" : "desc"}`);
    }

    const options_config: https.RequestOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: "GET",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
    };

    const req = https.request(options_config, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonData = JSON.parse(data);
            // Apply filters if needed
            let filteredData = jsonData;
            if (options.eq) {
              filteredData = jsonData.filter((item: Record<string, unknown>) => {
                return Object.entries(options.eq!).every(([key, value]) => {
                  return item[key] === value;
                });
              });
            }
            resolve({ data: filteredData, error: null });
          } catch (parseError) {
            resolve({ data: null, error: { message: "Failed to parse response", details: parseError } });
          }
        } else {
          resolve({ data: null, error: { message: `HTTP ${res.statusCode}`, details: data } });
        }
      });
    });

    req.on("error", (error: Error & { code?: string }) => {
      resolve({ 
        data: null, 
        error: { message: error.message, code: error.code } 
      });
    });

    req.end();
  });
}


