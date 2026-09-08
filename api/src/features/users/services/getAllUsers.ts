import type { AppContext } from "@/lib/db/context";
import * as UserRepo from "../repositories";
import type { User } from "../types";
import { AppResult } from "@/lib/result";

export const getAllUsers = (ctx: AppContext): AppResult<User[]> =>
  UserRepo.findAll(ctx);
