import { createFileRoute } from '@tanstack/react-router'
import PasswordResetPage from '../../../components/pages/settings/password-reset.page'

export const Route = createFileRoute('/_authenticated/settings/password-reset')({
  component: PasswordResetPage,
})