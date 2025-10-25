import { supabase } from './client';
import * as bcrypt from 'bcryptjs';
import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types';

const SALT_ROUNDS = 10;

/**
 * 新規ユーザー登録
 */
export async function register(credentials: RegisterCredentials): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { nickname, password } = credentials;

    // バリデーション
    if (!nickname || nickname.trim().length < 2) {
      return { user: null, error: 'ニックネームは2文字以上で入力してください' };
    }

    if (!password || password.length < 6) {
      return { user: null, error: 'パスワードは6文字以上で入力してください' };
    }

    // ニックネーム重複チェック
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', nickname.trim())
      .single();

    if (existing) {
      return { user: null, error: 'このニックネームは既に使用されています' };
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // ユーザー作成
    const { data, error } = await supabase
      .from('users')
      .insert({
        nickname: nickname.trim(),
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      console.error('Register error:', error);
      return { user: null, error: '登録に失敗しました' };
    }

    const user: AuthUser = {
      id: data.id,
      nickname: data.nickname,
      isGuest: false,
    };

    return { user, error: null };
  } catch (error) {
    console.error('Register exception:', error);
    return { user: null, error: '登録中にエラーが発生しました' };
  }
}

/**
 * ログイン
 */
export async function login(credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { nickname, password } = credentials;

    // バリデーション
    if (!nickname || !password) {
      return { user: null, error: 'ニックネームとパスワードを入力してください' };
    }

    // ユーザー取得
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('nickname', nickname.trim())
      .single();

    if (error || !data) {
      return { user: null, error: 'ニックネームまたはパスワードが正しくありません' };
    }

    // パスワード検証
    const isValid = await bcrypt.compare(password, data.password_hash);

    if (!isValid) {
      return { user: null, error: 'ニックネームまたはパスワードが正しくありません' };
    }

    const user: AuthUser = {
      id: data.id,
      nickname: data.nickname,
      isGuest: false,
    };

    return { user, error: null };
  } catch (error) {
    console.error('Login exception:', error);
    return { user: null, error: 'ログイン中にエラーが発生しました' };
  }
}

/**
 * ゲストログイン
 */
export function loginAsGuest(nickname: string): { user: AuthUser | null; error: string | null } {
  try {
    // バリデーション
    if (!nickname || nickname.trim().length < 2) {
      return { user: null, error: 'ニックネームは2文字以上で入力してください' };
    }

    const user: AuthUser = {
      id: `guest-${Date.now()}`,
      nickname: nickname.trim(),
      isGuest: true,
    };

    return { user, error: null };
  } catch (error) {
    console.error('Guest login exception:', error);
    return { user: null, error: 'ゲストログイン中にエラーが発生しました' };
  }
}

/**
 * ログアウト（クライアント側でのみ処理）
 */
export function logout(): void {
  // ローカルストレージをクリア
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-user');
  }
}
