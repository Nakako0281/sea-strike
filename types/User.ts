// ユーザー関連の型定義

export type User = {
  id: string;
  nickname: string;
  passwordHash: string;
  createdAt: Date;
};

export type AuthUser = {
  id: string;
  nickname: string;
  isGuest: boolean;
};

export type LoginCredentials = {
  nickname: string;
  password: string;
};

export type RegisterCredentials = {
  nickname: string;
  password: string;
};
