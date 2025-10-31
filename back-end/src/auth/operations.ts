import * as AccountOperations from "@/accounts/operations";
import { AccountAlreadyExistsError } from "@/accounts/types";
import type { AppContext } from "@/db/context";
import * as UserOperations from "@/users/operations";
import { type ResultAsync, errAsync } from "neverthrow";
import type {
  LoginParams,
  RegisterUserAndAccountParams,
  LoginResponse,
} from "./types";

import {
  EntityCreateError,
  EntityNotFoundError,
  EntityReadError,
} from "@/lib/errors/actionErrors";
import { UserEmailAlreadyInUseError } from "@/lib/errors/applicationErrors";
import { hashPassword } from "@/lib/utils/hashPassword";
import { comparePassword } from "@/lib/utils/comparePassword";
import { generateAccessToken, generateRefreshToken } from "@/lib/utils/jwt";
import {
  PasswordHashError,
  IncorrectPasswordError,
  PasswordCompareError,
  JwtGenerationError,
  InvalidEmailAndOrPasswordError,
} from "./types";
import type { User } from "@/users/types";
import { pinoInstance as logger } from "@/http/middleware/logger";

export const register = (
  params: RegisterUserAndAccountParams,
  ctx: AppContext,
): ResultAsync<
  User,
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof AccountAlreadyExistsError>
  | InstanceType<typeof EntityCreateError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof PasswordHashError>
> =>
  UserOperations.createUser(
    {
      name: params.name,
      email: params.email,
    },
    ctx,
  )
    .andThen((user) =>
      hashPassword(params.password).map((hashedPassword) => ({
        user,
        hashedPassword,
      })),
    )
    .andThen(({ user, hashedPassword }) =>
      AccountOperations.createAccount(
        {
          userId: user.id,
          password: hashedPassword,
        },
        ctx,
      ).map(() => user),
    )
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
          email: params.email,
          name: params.name,
        },
        "Registration failed",
      );
      return error;
    });

export const login = (
  params: LoginParams,
  ctx: AppContext,
): ResultAsync<
  LoginResponse,
  | InstanceType<typeof EntityNotFoundError>
  | InstanceType<typeof EntityReadError>
  | InstanceType<typeof IncorrectPasswordError>
  | InstanceType<typeof PasswordCompareError>
  | InstanceType<typeof JwtGenerationError>
  | InstanceType<typeof InvalidEmailAndOrPasswordError>
> =>
  UserOperations.getUserByEmail(params.email, ctx)
    .andThen((user) =>
      AccountOperations.getAccountByUserId(user.id, ctx).map((account) => ({
        user,
        account,
      })),
    )
    .andThen(({ user, account }) =>
      comparePassword(params.password, account.password).andThen((isMatch) =>
        isMatch
          ? generateAccessToken(user.id, user.email, user.name).andThen(
              (accessToken) =>
                generateRefreshToken(user.id, user.email, user.name).map(
                  (refreshToken) => ({
                    accessToken,
                    refreshToken,
                  }),
                ),
            )
          : errAsync(new IncorrectPasswordError()),
      ),
    )
    .orElse((error) =>
      error instanceof EntityNotFoundError || IncorrectPasswordError
        ? errAsync(new InvalidEmailAndOrPasswordError())
        : errAsync(error),
    )
    .mapErr((error) => {
      logger.error(
        {
          code: error.code,
          message: error.message,
          email: params.email,
        },
        "Login failed",
      );
      return error;
    });
