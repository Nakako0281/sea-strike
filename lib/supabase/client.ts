import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// テスト環境ではプレースホルダーを使用
const isTest = process.env.NODE_ENV === 'test';
const url = isTest && !supabaseUrl ? 'https://placeholder.supabase.co' : supabaseUrl;
const key = isTest && !supabaseAnonKey ? 'placeholder-key' : supabaseAnonKey;

if (!url || !key) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

export const supabase = createClient(url, key);

/**
 * Supabase接続をテストする関数
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      // テーブルが存在しない場合は接続自体は成功しているとみなす
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('Supabase connection successful (table not created yet)');
        return true;
      }
      console.error('Supabase connection test failed:', error);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}
