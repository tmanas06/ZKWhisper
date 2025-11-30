# ZKWhisper - Project Structure

## Overview
ZKWhisper is an anonymous messaging platform that uses Zero Knowledge Proofs (ZKPs) to verify organization membership without revealing user identity. Users can post messages anonymously while proving they belong to a specific organization (e.g., company domain).

## Project Architecture

```
zkwhisper/
├── app/                          # Next.js frontend application
│   ├── assets/                   # Static assets
│   │   ├── jwt/                  # JWT circuit verification keys
│   │   ├── google.png
│   │   ├── microsoft.png
│   │   └── logo.png
│   ├── components/               # React components
│   │   ├── layout.tsx           # Main layout wrapper
│   │   ├── message-card.tsx     # Individual message display
│   │   ├── message-form.tsx      # Message creation form
│   │   ├── message-list.tsx     # List of messages
│   │   ├── siwg.tsx             # Sign in with Google component
│   │   ├── siwm.tsx             # Sign in with Microsoft component
│   │   └── welcome-modal.tsx    # Welcome/onboarding modal
│   ├── hooks/                    # Custom React hooks
│   │   └── use-promise.ts       # Promise handling hook
│   ├── lib/                      # Core library code
│   │   ├── api.ts               # API client functions
│   │   ├── circuits/
│   │   │   └── jwt.ts           # JWT circuit helper
│   │   ├── core.ts              # Core business logic
│   │   ├── ephemeral-key.ts     # Ephemeral key management
│   │   ├── lazy-modules.ts      # Lazy loading utilities
│   │   ├── providers/           # OAuth providers
│   │   │   ├── google-oauth.ts  # Google OAuth integration
│   │   │   ├── microsoft-oauth.ts # Microsoft OAuth integration
│   │   │   └── index.ts         # Provider exports
│   │   ├── store.ts             # State management
│   │   ├── types.ts             # TypeScript type definitions
│   │   └── utils.ts             # Utility functions
│   ├── pages/                    # Next.js pages (file-based routing)
│   │   ├── api/                  # API routes
│   │   │   ├── messages/        # Message CRUD endpoints
│   │   │   │   ├── index.ts    # GET/POST /api/messages
│   │   │   │   └── [id].ts     # GET /api/messages/:id
│   │   │   ├── memberships.ts  # Membership registration
│   │   │   ├── likes.ts        # Like/unlike messages
│   │   │   ├── twitter.ts      # Twitter integration
│   │   │   └── test-*.ts       # Diagnostic endpoints
│   │   ├── [slug]/             # Dynamic routes for domains
│   │   │   └── [groupId]/      # Group-specific pages
│   │   ├── oauth-callback/     # OAuth callback handlers
│   │   ├── messages/           # Message detail pages
│   │   ├── index.tsx           # Home page
│   │   ├── _app.tsx            # App wrapper
│   │   └── _document.tsx       # Document wrapper
│   ├── styles/                  # SCSS stylesheets
│   │   ├── main.scss           # Main styles
│   │   ├── layout.scss         # Layout styles
│   │   ├── message-*.scss      # Message component styles
│   │   └── *.scss              # Component-specific styles
│   ├── next.config.mjs          # Next.js configuration
│   ├── package.json            # Dependencies and scripts
│   └── tsconfig.json           # TypeScript configuration
├── circuit/                     # Noir ZK circuit
│   ├── src/
│   │   └── main.nr             # Main circuit logic
│   ├── Nargo.toml              # Noir project config
│   └── build.sh                # Build script
├── schema.sql                   # Database schema
└── README.md                    # Project documentation
```

## Key Technologies

### Frontend
- **Next.js 14.2.11** - React framework with SSR
- **TypeScript** - Type safety
- **SCSS** - Styling
- **React 18** - UI library

### Zero Knowledge Proofs
- **Noir** - ZK circuit language
- **@noir-lang/noir_js** - Noir JavaScript bindings
- **@aztec/bb.js** - Barretenberg backend for proofs
- **noir-jwt** - JWT verification in circuits

### Cryptography
- **@noble/ed25519** - Ed25519 signature scheme
- **@noble/hashes** - Cryptographic hashing

### Backend/Database
- **Supabase** - PostgreSQL database + API
- **@supabase/supabase-js** - Supabase client

### OAuth Providers
- **Google OAuth** - Google Workspace authentication
- **Microsoft OAuth** - Microsoft 365 authentication

### Additional
- **twitter-api-v2** - Twitter integration
- **javascript-time-ago** - Time formatting
- **unique-names-generator** - Name generation

## Core Concepts

### 1. Ephemeral Keys
- Temporary key pairs stored in browser localStorage
- Used to sign messages anonymously
- Expire after a set time period
- Hash of pubkey used as nonce in OAuth flow

### 2. Zero Knowledge Proofs
- Proves organization membership without revealing identity
- Uses JWT tokens from OAuth providers (Google/Microsoft)
- Circuit verifies JWT signature and extracts domain/tenant ID
- Proof stored with membership registration

### 3. Anonymous Groups
- Groups based on organization domain (e.g., company.com)
- Members can post public or internal messages
- Internal messages only visible to same-group members
- Verified via ZK proofs

### 4. Message Flow
1. User generates ephemeral key pair
2. User authenticates with OAuth provider (Google/Microsoft)
3. ZK proof generated proving domain membership
4. Membership registered with ephemeral pubkey
5. Messages signed with ephemeral private key
6. Messages stored in Supabase with signature verification

## Database Schema

### Tables
- **memberships** - Ephemeral pubkey registrations with proofs
- **messages** - Anonymous messages with signatures
- **likes** - Message likes (linked to pubkeys)

### Key Fields
- `pubkey` - Ephemeral public key (primary identifier)
- `proof` - ZK proof of membership (JSONB)
- `group_id` - Organization identifier (domain/tenant ID)
- `provider` - OAuth provider name

## API Endpoints

### Messages
- `GET /api/messages` - Fetch messages (with filters)
- `POST /api/messages` - Create new message
- `GET /api/messages/[id]` - Get single message with proof

### Memberships
- `POST /api/memberships` - Register ephemeral pubkey with proof

### Likes
- `POST /api/likes` - Toggle like on message

### Twitter
- `POST /api/twitter` - Post messages to Twitter

## Environment Variables

Required:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

Optional:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID
- `TWITTER_API_KEY` - Twitter API credentials
- `TWITTER_API_SECRET`
- `TWITTER_ACCESS_TOKEN`
- `TWITTER_ACCESS_TOKEN_SECRET`

## Development Setup

1. Install dependencies: `yarn install`
2. Set up Supabase database: Run `schema.sql`
3. Configure `.env.local` with credentials
4. Run dev server: `yarn dev`

## Project Status

- ✅ Core ZK proof generation
- ✅ Google OAuth integration
- ✅ Microsoft OAuth integration
- ✅ Message posting and display
- ✅ Like functionality
- ✅ Internal/external message filtering
- ⚠️ Twitter integration (optional)
- ⚠️ SSL/certificate issues on Windows (workaround needed)

## Notes

- Uses Next.js Pages Router (not App Router)
- WebAssembly support required for ZK circuits
- Browser localStorage for ephemeral key storage
- Row Level Security enabled on Supabase tables
- Service role key used for server-side operations

