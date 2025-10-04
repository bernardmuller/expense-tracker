import { Data } from 'effect';

export class ValidationError extends Data.TaggedError('ValidationError')<{
  message: string;
}> { }

export class UserAlreadyDeletedError extends Data.TaggedError('UserAlreadyDeletedError')<{}> { }

export class AlreadyDeletedError extends Data.TaggedError('AlreadyDeletedError')<{}> { }

export class CreateTransactionError extends Data.TaggedError('CreateTransactionError')<{}> { }

export class UpdateTransactionError extends Data.TaggedError('UpdateTransactionError')<{}> { }

export class CreateBudgetError extends Data.TaggedError('CreateBudgetError')<{}> { }
