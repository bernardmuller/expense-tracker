export type User = {
  readonly id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  onboarded: boolean;
};

export function markUserAsOnboarded(user: User): User {
  return {
    ...user,
    onboarded: true
  };
}


export function markUserAsVerified(user: User): User {
  return {
    ...user,
    emailVerified: true
  };
}

export function updateUserProfile(user: User, updatedUser: User): User {
  return {
    ...user,
    name: updatedUser.name
  };
}
