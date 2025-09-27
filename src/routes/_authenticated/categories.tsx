import { createFileRoute } from '@tanstack/react-router'
import CategoriesPage from '../../components/pages/categories/categories.page'

export const Route = createFileRoute('/_authenticated/categories')({
  component: CategoriesPage,
})
