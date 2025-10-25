import { register, login, loginAsGuest, logout } from '@/lib/supabase/auth';
import * as bcrypt from 'bcryptjs';

// Supabaseクライアントのモック
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
        single: jest.fn(),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('Authentication Functions', () => {
  describe('loginAsGuest', () => {
    it('正常なニックネームでゲストユーザーを作成できる', () => {
      const result = loginAsGuest('テストユーザー');

      expect(result.error).toBeNull();
      expect(result.user).not.toBeNull();
      expect(result.user?.nickname).toBe('テストユーザー');
      expect(result.user?.isGuest).toBe(true);
      expect(result.user?.id).toContain('guest-');
    });

    it('2文字未満のニックネームでエラーが返る', () => {
      const result = loginAsGuest('a');

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error).toContain('2文字以上');
    });

    it('空のニックネームでエラーが返る', () => {
      const result = loginAsGuest('');

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
    });

    it('前後の空白を削除する', () => {
      const result = loginAsGuest('  テスト  ');

      expect(result.error).toBeNull();
      expect(result.user?.nickname).toBe('テスト');
    });
  });

  describe('logout', () => {
    it('ログアウト関数が実行できる', () => {
      expect(() => logout()).not.toThrow();
    });
  });

  describe('register', () => {
    it('バリデーション: ニックネームが2文字未満', async () => {
      const result = await register({ nickname: 'a', password: 'password123' });

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error).toContain('2文字以上');
    });

    it('バリデーション: パスワードが6文字未満', async () => {
      const result = await register({ nickname: 'testuser', password: '12345' });

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
      expect(result.error).toContain('6文字以上');
    });
  });

  describe('login', () => {
    it('バリデーション: ニックネームが空', async () => {
      const result = await login({ nickname: '', password: 'password123' });

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
    });

    it('バリデーション: パスワードが空', async () => {
      const result = await login({ nickname: 'testuser', password: '' });

      expect(result.error).not.toBeNull();
      expect(result.user).toBeNull();
    });
  });

  describe('bcrypt functions', () => {
    it('パスワードハッシュ化が動作する', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('パスワード検証が動作する', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hash);
      const isInvalid = await bcrypt.compare('wrongPassword', hash);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });
});
