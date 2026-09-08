import {
  UserAlreadyOnboardedError,
  UserEmailAlreadyInUseError,
  UserAlreadyVerifiedError,
} from "../errors";

export type UserValidationError =
  | InstanceType<typeof UserAlreadyOnboardedError>
  | InstanceType<typeof UserEmailAlreadyInUseError>
  | InstanceType<typeof UserAlreadyVerifiedError>;
