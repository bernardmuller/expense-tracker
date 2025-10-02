import { createFileRoute } from '@tanstack/react-router'
import SettingsPage from '../../components/pages/settings/settings.page'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})
