import { nonePlaceholderProps } from './NonePlaceholder.factory'
import type { NoneplaceholderProps } from '../NonePlaceholder'

export const generateNonePlaceholderProps = (
  overwrites: Partial<NoneplaceholderProps> = {},
) => ({
  ...nonePlaceholderProps,
  ...overwrites,
})
