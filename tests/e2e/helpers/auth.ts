import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

// Use service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function createTestUser() {
  const timestamp = Date.now();
  const email = `test-${timestamp}@example.com`;
  const password = `TestPassword123!${timestamp}`;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email for testing
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  if (!data.user) {
    throw new Error("Failed to create test user: no user returned");
  }

  return {
    email,
    password,
    userId: data.user.id,
  };
}

export async function deleteTestUser(email: string) {
  // Find user by email
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error("Failed to list users for cleanup:", listError);
    return;
  }

  const user = users.users.find((u) => u.email === email);
  if (!user) {
    console.warn(`Test user not found for cleanup: ${email}`);
    return;
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error(`Failed to delete test user ${email}:`, deleteError);
  }
}
