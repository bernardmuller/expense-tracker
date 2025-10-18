import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type SpinnerButtonProps = {
  enabledText: string
  onClick: () => void
  className?: string
} & (
  | {
      disabled?: false
    }
  | {
      disabled: true
      disabledText: string
    }
)

export function SpinnerButton(props: SpinnerButtonProps) {
  const { enabledText, onClick, className } = props
  const text = props.disabled ? props.disabledText : enabledText

  return (
    <Button
      disabled={props.disabled}
      size="sm"
      onClick={onClick}
      className={className}
    >
      {props.disabled && <Spinner />}
      {text}
    </Button>
  )
}
