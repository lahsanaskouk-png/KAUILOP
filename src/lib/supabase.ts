import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ocjxewdtihtlhckhrxit.supabase.co';
const supabaseAnonKey = 'sb_publishable_OrGLz6VTWwbnka1AMvTKLQ_1fV4aTep';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
}

export function convertPhoneToEmail(phone: string): string {
  return `${phone}@brixa.com`;
}

export async function signUp(phone: string, password: string): Promise<AuthResponse> {
  const email = convertPhoneToEmail(phone);

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true };
}

export async function signIn(phone: string, password: string): Promise<AuthResponse> {
  const email = convertPhoneToEmail(phone);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: { message: error.message } };
  }

  return { success: true };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
