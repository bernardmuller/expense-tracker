import type { Transaction } from "@/domain/entities/transaction";
import type { BaseRepository } from "./baseRepository";

export interface TransactionRepository extends BaseRepository<Transaction> {}
