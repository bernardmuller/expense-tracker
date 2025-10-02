import { Data } from 'effect';

export class UserAlreadyDeletedError extends Data.TaggedError(
  'UserAlreadyDeletedError'
)<{}> { }
