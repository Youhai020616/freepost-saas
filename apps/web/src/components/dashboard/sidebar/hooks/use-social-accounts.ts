"use client";

import { useMemo } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DEFAULT_VISIBLE_PLATFORMS, PLATFORM_DEFINITIONS } from "../utils/constants";
import { SocialAccount } from "../types";

const SOCIAL_ACCOUNTS_QUERY_KEY = ["dashboard", "social-accounts"] as const;

function buildInitialAccounts(): SocialAccount[] {
  const now = new Date().toISOString();

  return PLATFORM_DEFINITIONS.map((platform, index) => ({
    ...platform,
    username:
      platform.id === "twitter" || platform.id === "instagram"
        ? "@username"
        : "Not connected",
    connected: platform.id === "twitter" || platform.id === "instagram",
    isVisible: DEFAULT_VISIBLE_PLATFORMS.includes(platform.id),
    isActive: platform.id === "twitter" || platform.id === "instagram",
    lastSyncAt: now,
    status:
      platform.id === "twitter" || platform.id === "instagram"
        ? "active"
        : "expired",
    errorMessage: undefined,
    order: index,
    createdAt: now,
    updatedAt: now,
  }));
}

async function fetchSocialAccounts(): Promise<SocialAccount[]> {
  // TODO: 替换为真实 API 请求
  return buildInitialAccounts();
}

function updateAccountCollection(
  accounts: SocialAccount[] | undefined,
  updater: (account: SocialAccount) => SocialAccount
) {
  if (!accounts) return [] as SocialAccount[];
  return accounts.map(updater);
}

export function prefetchSocialAccounts(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: SOCIAL_ACCOUNTS_QUERY_KEY,
    queryFn: fetchSocialAccounts,
  });
}

export function useSocialAccounts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SOCIAL_ACCOUNTS_QUERY_KEY,
    queryFn: fetchSocialAccounts,
  });

  const toggleVisibility = useMutation({
    mutationFn: async (platformId: string) => platformId,
    onMutate: async (platformId) => {
      await queryClient.cancelQueries({ queryKey: SOCIAL_ACCOUNTS_QUERY_KEY });

      const previous = queryClient.getQueryData<SocialAccount[]>(
        SOCIAL_ACCOUNTS_QUERY_KEY
      );

      queryClient.setQueryData<SocialAccount[]>(
        SOCIAL_ACCOUNTS_QUERY_KEY,
        (current) =>
          updateAccountCollection(current, (account) =>
            account.id === platformId
              ? { ...account, isVisible: !account.isVisible }
              : account
          )
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SOCIAL_ACCOUNTS_QUERY_KEY, context.previous);
      }
    },
  });

  const removeFromSidebar = useMutation({
    mutationFn: async (platformId: string) => platformId,
    onMutate: async (platformId) => {
      await queryClient.cancelQueries({ queryKey: SOCIAL_ACCOUNTS_QUERY_KEY });

      const previous = queryClient.getQueryData<SocialAccount[]>(
        SOCIAL_ACCOUNTS_QUERY_KEY
      );

      queryClient.setQueryData<SocialAccount[]>(
        SOCIAL_ACCOUNTS_QUERY_KEY,
        (current) =>
          updateAccountCollection(current, (account) =>
            account.id === platformId
              ? { ...account, isVisible: false }
              : account
          )
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SOCIAL_ACCOUNTS_QUERY_KEY, context.previous);
      }
    },
  });

  const accounts = useMemo(() => query.data ?? [], [query.data]);

  return {
    accounts,
    isLoading: query.isLoading,
    isError: query.isError,
    toggleVisibility,
    removeFromSidebar,
    refetch: query.refetch,
  };
}
