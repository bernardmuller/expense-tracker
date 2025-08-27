import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/test')({
  component: () => <div>Test route works</div>,
})