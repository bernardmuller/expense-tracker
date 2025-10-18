import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type SpinnerButtonProps = {
  enabledText: string
<<<<<<< HEAD
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
=======
  onClick: () => void
  className?: string
} & (
  | {
      disabled?: false
    }
  | {
      disabled: true
>>>>>>> 4bedd2e (feat: spinner component)
      disabledText: string
    }
)

export function SpinnerButton(props: SpinnerButtonProps) {
  const { enabledText, onClick, className } = props
<<<<<<< HEAD
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
=======
  const text = props.disabled ? props.disabledText : enabledText

  return (
    <Button
      disabled={props.disabled}
      size="sm"
      onClick={onClick}
      className={className}
    >
      {props.disabled && <Spinner />}
>>>>>>> 4bedd2e (feat: spinner component)
      {text}
    </Button>
  )
}
