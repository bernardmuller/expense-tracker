import { useFormContext } from '@/hooks/form-context'
import { SpinnerButton } from '../spinner-button/SpinnerButton'

export default function FormButton({
  enabledText,
  loadingText,
  disabledText,
  formId,
}: {
  enabledText: string
  loadingText: string
  disabledText: string
  formId: string
}) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <SpinnerButton
          enabledText={enabledText}
          className="w-full"
          isDisabled={!canSubmit}
          isLoading={isSubmitting}
          disabledText={isSubmitting ? loadingText : disabledText}
          buttonProps={{ type: 'submit', form: formId }}
        />
      )}
    />
  )
}
