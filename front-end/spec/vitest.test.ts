import { faker } from '@faker-js/faker/locale/en';
import { describe, expect, it } from 'vitest';

describe('reverse array', () => {
  it('should reverse the array', () => {
    const title = faker.person.jobTitle();
    const name = faker.person.fullName();
    const animal = faker.animal.bear();

    const array = [title, name, animal];

    expect(array.reverse()).toStrictEqual([animal, name, title]);
  });
});
