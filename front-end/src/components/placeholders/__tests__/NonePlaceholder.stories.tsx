import { NonePlaceholder } from '../NonePlaceholder'
import { generateNonePlaceholderProps } from '../__mocks__/NonePlaceholder.mock'
import type { Meta, StoryObj } from '@storybook/react-vite'

const { headerEmoji, contentText, footerText } = generateNonePlaceholderProps()

const meta = {
  title: 'None Placeholder',
  component: NonePlaceholder,
} satisfies Meta<typeof NonePlaceholder>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    headerEmoji: headerEmoji,
    contentText: contentText,
    footerText: footerText,
  },
}
