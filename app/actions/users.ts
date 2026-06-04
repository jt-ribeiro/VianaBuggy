'use server';

import { createServiceRoleClient } from '@/lib/supabase/service';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function addUser(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;

  if (!email || !name || !role || !password) {
    return { error: 'Preenche todos os campos.' };
  }

  // Verify that the caller is an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Não autorizado.' };
  
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single();
    
  if (adminUser?.role !== 'admin') {
    return { error: 'Apenas administradores podem adicionar utilizadores.' };
  }

  // Use Service Role to create the user in Supabase Auth
  const adminSupabase = createServiceRoleClient();
  
  const { data: newAuthUser, error: authError } = await adminSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm the user
  });

  if (authError) {
    return { error: `Erro ao criar utilizador (Auth): ${authError.message}` };
  }

  // Insert into admin_users table
  const { error: dbError } = await adminSupabase
    .from('admin_users')
    .insert({
      id: newAuthUser.user.id,
      email,
      name,
      role,
      is_active: true,
    });

  if (dbError) {
    // Rollback auth user creation if DB insert fails
    await adminSupabase.auth.admin.deleteUser(newAuthUser.user.id);
    return { error: `Erro ao criar utilizador (BD): ${dbError.message}` };
  }

  revalidatePath('/admin/users');
  return { success: true };
}
