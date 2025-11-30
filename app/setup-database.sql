-- SQL Editor

-- Create helper functions for likes
CREATE OR REPLACE FUNCTION "public"."increment_likes_count"("message_id" "text") 
RETURNS "void"
LANGUAGE "plpgsql"
AS $$
BEGIN
  UPDATE messages 
  SET likes = likes + 1
  WHERE id = message_id;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."decrement_likes_count"("message_id" "text") 
RETURNS "void"
LANGUAGE "plpgsql"
AS $$
BEGIN
  UPDATE messages 
  SET likes = likes - 1
  WHERE id = message_id;
END;
$$;

-- Create memberships table
CREATE TABLE IF NOT EXISTS "public"."memberships" (
    "pubkey" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "proof" "jsonb" NOT NULL,
    "proof_args" "jsonb" NOT NULL,
    "group_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "pubkey_expiry" timestamp with time zone,
    CONSTRAINT "keys_pkey" PRIMARY KEY ("pubkey")
);

-- Create messages table
CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "text" NOT NULL,
    "text" "text" NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "signature" "text" NOT NULL,
    "pubkey" "text" NOT NULL,
    "internal" boolean NOT NULL,
    "likes" numeric DEFAULT '0'::numeric NOT NULL,
    "group_id" "text" NOT NULL,
    "group_provider" "text" NOT NULL,
    "tweeted" boolean DEFAULT false,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "messages_pubkey_fkey" FOREIGN KEY ("pubkey") REFERENCES "public"."memberships"("pubkey")
);

COMMENT ON TABLE "public"."messages" IS 'Anon messages for all domains';

-- Create likes table
CREATE TABLE IF NOT EXISTS "public"."likes" (
    "message_id" "text" NOT NULL,
    "pubkey" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "likes_pkey" PRIMARY KEY ("message_id", "pubkey"),
    CONSTRAINT "likes_pubkey_fkey" FOREIGN KEY ("pubkey") REFERENCES "public"."memberships"("pubkey")
);

-- Enable Row Level Security
ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";

GRANT ALL ON TABLE "public"."memberships" TO "anon";
GRANT ALL ON TABLE "public"."memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."memberships" TO "service_role";

GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";

GRANT ALL ON FUNCTION "public"."increment_likes_count"("message_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_likes_count"("message_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_likes_count"("message_id" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."decrement_likes_count"("message_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."decrement_likes_count"("message_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."decrement_likes_count"("message_id" "text") TO "service_role";


