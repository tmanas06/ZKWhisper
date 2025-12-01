import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Get all POAPs owned by a wallet address
 * Returns list of POAP events the wallet has attended
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    // Normalize wallet address
    const normalizedAddress = walletAddress.toLowerCase();

    // Query POAP API to get all POAPs
    // POAP API endpoint: https://api.poap.tech/actions/scan/{address}
    // Note: This endpoint may require an API key for higher rate limits
    const poapApiUrl = `https://api.poap.tech/actions/scan/${normalizedAddress}`;
    
    let poaps: any[] = [];

    try {
      const headers: Record<string, string> = {
        "Accept": "application/json",
        "User-Agent": "ZKWhisper/1.0",
      };
      
      // API key is required for POAP API to avoid 403 errors
      if (process.env.POAP_API_KEY) {
        headers["X-API-Key"] = process.env.POAP_API_KEY;
      } else {
        console.warn("POAP_API_KEY not set. API may return 403 Forbidden.");
      }

      const response = await fetch(poapApiUrl, { headers });

      const responseText = await response.text();
      console.log(`POAP API Response Status: ${response.status}`);
      console.log(`POAP API Response: ${responseText.substring(0, 500)}`);

      if (response.ok) {
        let data: any;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse POAP API response:", parseError);
          return res.status(500).json({ 
            error: "Invalid response from POAP API",
            details: "Response is not valid JSON"
          });
        }
        
        // POAP API can return different formats:
        // 1. Direct array: [{tokenId, event: {...}, ...}]
        // 2. Object with array: {poaps: [...]}
        // 3. Object with nested structure
        
        if (Array.isArray(data)) {
          // Direct array format
          poaps = data.map((poap: any) => ({
            tokenId: poap.tokenId,
            eventId: poap.event?.id?.toString(),
            eventName: poap.event?.name || `POAP Event #${poap.event?.id}`,
            eventDescription: poap.event?.description || "",
            eventImageUrl: poap.event?.image_url || poap.event?.imageUrl || "",
            created: poap.created,
          })).filter((poap: any) => poap.eventId); // Filter out any without eventId
        } else if (data && Array.isArray(data.poaps)) {
          // Object with poaps array
          poaps = data.poaps.map((poap: any) => ({
            tokenId: poap.tokenId,
            eventId: poap.event?.id?.toString(),
            eventName: poap.event?.name || `POAP Event #${poap.event?.id}`,
            eventDescription: poap.event?.description || "",
            eventImageUrl: poap.event?.image_url || poap.event?.imageUrl || "",
            created: poap.created,
          })).filter((poap: any) => poap.eventId);
        } else if (data && typeof data === "object") {
          // Try to find any array property
          const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
          if (arrayKeys.length > 0) {
            const arrayData = data[arrayKeys[0]];
            poaps = arrayData.map((poap: any) => ({
              tokenId: poap.tokenId || poap.id,
              eventId: poap.event?.id?.toString() || poap.eventId?.toString(),
              eventName: poap.event?.name || poap.name || `POAP Event #${poap.event?.id || poap.eventId}`,
              eventDescription: poap.event?.description || poap.description || "",
              eventImageUrl: poap.event?.image_url || poap.event?.imageUrl || poap.image_url || poap.imageUrl || "",
              created: poap.created || poap.createdAt,
            })).filter((poap: any) => poap.eventId);
          }
        }

        console.log(`Parsed ${poaps.length} POAPs from response`);
      } else if (response.status === 403) {
        // API key required or rate limited
        const errorMsg = process.env.POAP_API_KEY 
          ? "POAP API returned 403 Forbidden. Your API key may be invalid or you may have hit rate limits."
          : "POAP API requires an API key. Please set POAP_API_KEY in your environment variables. Get one at https://app.poap.tech/";
        
        console.error(errorMsg);
        return res.status(403).json({ 
          error: errorMsg,
          requiresApiKey: !process.env.POAP_API_KEY
        });
      } else if (response.status === 404) {
        // Wallet has no POAPs - this is valid
        console.log("Wallet has no POAPs (404)");
        poaps = [];
      } else {
        console.warn(`POAP API returned status ${response.status}`);
        let errorData: any = {};
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText };
        }
        return res.status(response.status).json({ 
          error: `POAP API error: ${errorData.message || `Status ${response.status}`}`,
          details: responseText.substring(0, 200),
          requiresApiKey: response.status === 403 && !process.env.POAP_API_KEY
        });
      }
    } catch (apiError) {
      console.error("POAP API error:", apiError);
      
      // Check if it's a DNS/network error
      if (apiError instanceof Error && apiError.message.includes("ENOTFOUND")) {
        return res.status(500).json({ 
          error: "Failed to connect to POAP API. Please check your internet connection.",
          details: apiError.message
        });
      }
      
      return res.status(500).json({ 
        error: "Failed to fetch POAPs from API",
        details: apiError instanceof Error ? apiError.message : "Unknown error"
      });
    }

    return res.status(200).json({
      walletAddress: normalizedAddress,
      poaps,
      count: poaps.length,
    });
  } catch (error) {
    console.error("POAP list error:", error);
    return res.status(500).json({ 
      error: "Failed to list POAPs",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
