import type { Budget } from "@/domain/entities/budget";
import type { BaseRepository } from "./baseRepository";

export interface BudgetRepository extends BaseRepository<Budget> {}
