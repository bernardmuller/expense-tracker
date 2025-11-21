import { useMutation } from "@tanstack/react-query";
import { Result, ok } from "neverthrow";
import { toast } from "sonner";
import { client, toResult } from "../client";
import { queryKeys } from "../query-keys";
import type { paths } from "../schema";

type RegisterRequestBody =
  paths["/auth/register/request"]["post"]["requestBody"]["content"]["application/json"];

type RegisterRequestSuccess =
  paths["/auth/register/request"]["post"]["responses"]["200"]["content"]["application/json"];

type RegisterRequestError =
  | paths["/auth/register/request"]["post"]["responses"]["409"]["content"]["application/json"]
  | paths["/auth/register/request"]["post"]["responses"]["500"]["content"]["application/json"];

export function useRegisterRequest() {
  return useMutation({
    mutationKey: queryKeys.auth.register.request(),
    mutationFn: async (
      body: RegisterRequestBody
    ): Promise<Result<RegisterRequestSuccess, RegisterRequestError>> => {
      return toResult(client.POST("/auth/register/request", { body }))
        .andThen((data) => {
          sessionStorage.setItem("token", data.token);
          return ok(data);
        })
        .mapErr((error) => {
          toast.error(error.message || "Failed to send registration request");
          return error;
        });
    },
  });
}
