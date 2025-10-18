import * as NonePlaceholderCompound from './NonePlaceholder.compound'

export type NoneplaceholderProps = {
  headerEmoji: string
  contentText: string
  footerText: string
}

export function NonePlaceholder({
  headerEmoji,
  contentText,
  footerText,
}: NoneplaceholderProps) {
  return (
    <NonePlaceholderCompound.Root>
      <NonePlaceholderCompound.Header emoji={headerEmoji} />
      <NonePlaceholderCompound.Content text={contentText} />
      <NonePlaceholderCompound.Footer text={footerText} />
    </NonePlaceholderCompound.Root>
  )
}
