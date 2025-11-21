import { useMutation } from "@tanstack/react-query";
import { Result } from "neverthrow";
import { toast } from "sonner";
import { client, toResult } from "../client";
import { queryKeys } from "../query-keys";
import type { paths } from "../schema";

type RefreshTokenSuccess =
  paths["/auth/refresh"]["post"]["responses"]["200"]["content"]["application/json"];

type RefreshTokenError =
  | paths["/auth/refresh"]["post"]["responses"]["401"]["content"]["application/json"]
  | paths["/auth/refresh"]["post"]["responses"]["404"]["content"]["application/json"]
  | paths["/auth/refresh"]["post"]["responses"]["500"]["content"]["application/json"];

interface RefreshTokenParams {
  refreshToken: string;
}

export function useRefreshToken() {
  return useMutation({
    mutationKey: queryKeys.auth.refresh(),
    mutationFn: async ({
      refreshToken,
    }: RefreshTokenParams): Promise<
      Result<RefreshTokenSuccess, RefreshTokenError>
    > => {
      return toResult(
        client.POST("/auth/refresh", {
          params: {
            header: {
              authorization: `Bearer ${refreshToken}`,
            },
          },
        })
      ).mapErr((error) => {
        toast.error(error.message || "Failed to refresh token");
        return error;
      });
    },
  });
}
