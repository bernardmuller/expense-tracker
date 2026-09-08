import type { Meta, StoryObj } from '@storybook/react'
import { Swiper } from '../Swiper'
import { X, Check, Archive, Star } from 'lucide-react'

const meta = {
  title: 'Swiper',
  component: Swiper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    leftAction: {
      description: 'Configuration for left swipe action',
    },
    rightAction: {
      description: 'Configuration for right swipe action',
    },
    children: {
      description: 'Main content to be wrapped in the swiper',
    },
  },
} satisfies Meta<typeof Swiper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    leftAction: {
      content: <X className="h-6 w-6 text-white" />,
      onAction: () => {
        alert('Left action triggered!')
      },
      backgroundColor: '#ef4444',
    },
    rightAction: {
      content: <Check className="h-6 w-6 text-white" />,
      onAction: () => {
        alert('Right action triggered!')
      },
      backgroundColor: '#10b981',
    },
    children: (
      <div className="text-center">
        <p className="text-lg">Swipe me left or right!</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-screen">
        <Story />
      </div>
    ),
  ],
}

export const CustomStyled: Story = {
  args: {
    leftAction: {
      content: <Archive className="h-6 w-6 text-white" />,
      onAction: () => {
        alert('Archived!')
      },
      backgroundColor: '#f59e0b',
      width: '150px',
    },
    rightAction: {
      content: <Star className="h-6 w-6 text-white" />,
      onAction: () => {
        alert('Starred!')
      },
      backgroundColor: '#8b5cf6',
      width: '150px',
    },
    children: (
      <div
        className="p-4a rounded-lg bg-gradient-to-r from-blue-500 to-purple-600
          p-4 text-white"
      >
        <h3 className="font-bold">Custom Styled Card</h3>
        <p className="text-sm">With custom colors and widths</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-screen">
        <Story />
      </div>
    ),
  ],
}
