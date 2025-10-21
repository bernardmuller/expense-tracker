import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type SpinnerButtonProps = {
  enabledText: string
  onClick?: () => void
  className?: string
  buttonProps?: React.ComponentProps<'button'>
} & (
  | {
      isDisabled?: false
    }
  | {
      isLoading?: boolean
      isDisabled: true
      disabledText: string
    }
)

export function SpinnerButton(props: SpinnerButtonProps) {
  const { enabledText, onClick, className } = props
  const text = props.isDisabled ? props.disabledText : enabledText

  return (
    <Button
      disabled={props.isDisabled}
      size="sm"
      onClick={onClick}
      className={className}
      {...props.buttonProps}
    >
      {props.isDisabled && props.isLoading && <Spinner />}
      {text}
    </Button>
  )
}
