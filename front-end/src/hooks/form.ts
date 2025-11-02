import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form-context'
import NumberField from '@/components/form/NumberField'
import TextField from '@/components/form/TextField'
import FormButton from '@/components/form/FormButton'
import SelectField from '@/components/form/SelectField'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NumberField,
    TextField,
    SelectField,
  },
  formComponents: {
    FormButton,
  },
})
