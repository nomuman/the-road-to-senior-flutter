import { create } from 'zustand';
import { supabase } from '@/shared/api/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // 初期ロード状態
  setUser: (user) => set({ user }),
}));

// 認証状態を監視し、Zustandストアを更新する
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user || null);
  useAuthStore.setState({ isLoading: false }); // 認証状態の初期ロード完了
});

export const useAuth = () => {
  const { user, isLoading, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  // 現在のユーザーセッションを取得するクエリ
  const { data: sessionData, isLoading: isSessionLoading } = useQuery<Session | null>({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: Infinity, // セッションは頻繁に変わらないため
  });

  useEffect(() => {
    if (sessionData) {
      setUser(sessionData.user);
    }
  }, [sessionData, setUser]);


  // サインアップミューテーション
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  // ログインミューテーション
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });

  // ログアウトミューテーション
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.clear(); // 全てのクエリキャッシュをクリア
    },
  });

  return {
    user,
    isLoading: isLoading || isSessionLoading, // 両方のロード状態を考慮
    signUp: signUpMutation.mutateAsync,
    signIn: signInMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isAuthenticated: !!user,
  };
};