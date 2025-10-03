import { Data } from 'effect';

export class UserAlreadyDeletedError extends Data.TaggedError(
  'UserAlreadyDeletedError'
)<{}> { }

export class CreateTransactionError extends Data.TaggedError('CreateTransactionError')<{}> { }

export class UpdateTransactionError extends Data.TaggedError('UpdateTransactionError')<{
}> { }
