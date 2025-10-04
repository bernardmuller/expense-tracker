import { Data } from 'effect';

export class UserAlreadyDeletedError extends Data.TaggedError(
  'UserAlreadyDeletedError'
)<{}> { }

export class AlreadyDeletedError extends Data.TaggedError(
  'AlreadyDeletedError'
)<{}> { }

export class CreateTransactionError extends Data.TaggedError('CreateTransactionError')<{}> { }

export class UpdateTransactionError extends Data.TaggedError('UpdateTransactionError')<{
}> { }
