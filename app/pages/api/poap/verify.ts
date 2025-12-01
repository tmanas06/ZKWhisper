import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Verify POAP NFT ownership for a wallet address
 * Uses POAP API to check if wallet holds the specified POAP event
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { walletAddress, poapEventId } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    if (!poapEventId) {
      return res.status(400).json({ 
        error: "POAP event ID is required. Please select a POAP event." 
      });
    }

    // Normalize wallet address
    const normalizedAddress = walletAddress.toLowerCase();

    // Query POAP API to check ownership
    // POAP API endpoint: https://api.poap.xyz/actions/scan/{address}
    const poapApiUrl = `https://api.poap.xyz/actions/scan/${normalizedAddress}`;
    
    let hasPOAP = false;
    let poapTokenId: string | undefined;
    let foundEventId: string | undefined;
    let eventName: string | undefined;

    try {
      const response = await fetch(poapApiUrl, {
        headers: {
          "X-API-Key": process.env.POAP_API_KEY || "",
        },
      });

      if (response.ok) {
        const poaps = await response.json();
        
        // Check if wallet holds the specified POAP
        if (Array.isArray(poaps)) {
          const matchingPOAP = poaps.find(
            (poap: { event?: { id?: number } }) => 
              poap.event?.id?.toString() === poapEventId.toString()
          );
          
          if (matchingPOAP) {
            hasPOAP = true;
            poapTokenId = matchingPOAP.tokenId;
            foundEventId = matchingPOAP.event?.id?.toString();
            eventName = matchingPOAP.event?.name;
          }
        }
      } else if (response.status === 404) {
        // Wallet has no POAPs
        hasPOAP = false;
      } else {
        console.warn(`POAP API returned status ${response.status}`);
      }
    } catch (apiError) {
      console.error("POAP API error:", apiError);
      return res.status(500).json({ 
        error: "Failed to verify POAP ownership",
        details: apiError instanceof Error ? apiError.message : "Unknown error"
      });
    }

    if (!hasPOAP) {
      return res.status(403).json({
        hasPOAP: false,
        error: `You don't hold POAP event #${poapEventId}. Please select a POAP you own.`,
        walletAddress: normalizedAddress,
        poapEventId,
      });
    }

    return res.status(200).json({
      hasPOAP: true,
      walletAddress: normalizedAddress,
      poapEventId: foundEventId || poapEventId,
      poapTokenId,
      eventName,
    });
  } catch (error) {
    console.error("POAP verification error:", error);
    return res.status(500).json({ 
      error: "Failed to verify POAP ownership",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
