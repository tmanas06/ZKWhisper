// Quick test script to verify Supabase connection
// Run with: node test-supabase-connection.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'MISSING');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'MISSING');
  process.exit(1);
}

console.log('✓ Environment variables found');
console.log('URL:', supabaseUrl);
console.log('Key starts with:', supabaseKey.substring(0, 20) + '...\n');

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.warn('⚠️  Warning: URL format looks incorrect');
  console.warn('Expected format: https://xxxxx.supabase.co\n');
}

// Validate key format
if (!supabaseKey.startsWith('eyJ')) {
  console.warn('⚠️  Warning: Key format looks incorrect');
  console.warn('Expected JWT token starting with "eyJ"\n');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
console.log('Testing database connection...');
supabase
  .from('messages')
  .select('id')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Connection failed!');
      console.error('Error:', error.message);
      console.error('\nTroubleshooting:');
      console.error('1. Check that your Supabase project is active');
      console.error('2. Verify the URL is correct (no trailing slash)');
      console.error('3. Verify you\'re using the service_role key (not anon key)');
      console.error('4. Check that the database tables exist');
      process.exit(1);
    } else {
      console.log('✅ Connection successful!');
      console.log('Database is accessible.');
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('❌ Network error!');
    console.error('Error:', err.message);
    console.error('\nThis might be a network/firewall issue.');
    console.error('Check your internet connection and try again.');
    process.exit(1);
  });


