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
      <NonePlaceholderCompound.Header>
        <NonePlaceholderCompound.Emoji emoji={headerEmoji} />
      </NonePlaceholderCompound.Header>
      <NonePlaceholderCompound.Content>
        <NonePlaceholderCompound.BoldText text={contentText} />
      </NonePlaceholderCompound.Content>
      <NonePlaceholderCompound.Footer>
        <NonePlaceholderCompound.MutedText text={footerText} />
      </NonePlaceholderCompound.Footer>
    </NonePlaceholderCompound.Root>
  )
}
