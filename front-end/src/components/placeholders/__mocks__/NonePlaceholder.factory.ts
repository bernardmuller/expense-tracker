import { faker } from '@faker-js/faker'
import type { NoneplaceholderProps } from '../NonePlaceholder'

export const nonePlaceholderProps: NoneplaceholderProps = {
  headerEmoji: faker.internet.emoji(),
  contentText: faker.lorem.words({ min: 2, max: 4 }),
  footerText: faker.lorem.words({ min: 5, max: 11 }),
}
