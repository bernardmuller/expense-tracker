import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export default function setupUserEvent(component: React.ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(component),
  }
}
