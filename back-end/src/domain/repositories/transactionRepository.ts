import { Context } from "effect";
import type { Transaction } from "@/domain/entities/transaction";
import type { BaseRepositoryShape } from "./baseRepository";

export interface TransactionRepositoryShape
  extends BaseRepositoryShape<Transaction> {}

export class TransactionRepository extends Context.Tag(
  "domain/repositories/transactionRepository",
)<TransactionRepository, TransactionRepositoryShape>() {}
