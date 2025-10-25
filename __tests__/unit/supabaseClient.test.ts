import { supabase, testSupabaseConnection } from '@/lib/supabase/client';

// 環境変数のモック
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-key',
};

describe('Supabase Client', () => {
  beforeAll(() => {
    // 環境変数を設定
    process.env.NEXT_PUBLIC_SUPABASE_URL = mockEnv.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = mockEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  describe('supabase client initialization', () => {
    it('should create a Supabase client instance', () => {
      expect(supabase).toBeDefined();
      expect(supabase).toHaveProperty('from');
      expect(supabase).toHaveProperty('auth');
    });
  });

  describe('testSupabaseConnection', () => {
    it('should be a function', () => {
      expect(typeof testSupabaseConnection).toBe('function');
    });

    it('should return a promise', () => {
      const result = testSupabaseConnection();
      expect(result).toBeInstanceOf(Promise);
    });

    // Note: 実際の接続テストはプレースホルダーURLでは失敗するため、
    // 実際のSupabaseプロジェクトが設定された後に有効化する
    it.skip('should successfully connect to Supabase', async () => {
      const isConnected = await testSupabaseConnection();
      expect(isConnected).toBe(true);
    });
  });

  describe('environment variables validation', () => {
    it('should have NEXT_PUBLIC_SUPABASE_URL defined', () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe(mockEnv.NEXT_PUBLIC_SUPABASE_URL);
    });

    it('should have NEXT_PUBLIC_SUPABASE_ANON_KEY defined', () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(mockEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    });
  });
});
