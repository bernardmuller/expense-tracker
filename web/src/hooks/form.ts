import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form-context'
import NumberField from '@/components/form/NumberField'
import TextField from '@/components/form/TextField'
import FormButton from '@/components/form/FormButton'
import SelectField from '@/components/form/SelectField'
import OtpField from '@/components/form/OtpField'

import BudgetFrequencyField from '@/components/form/BudgetFrequencyField'
import BudgetStartDayField from '@/components/form/BudgetStartDayField'
import SearchableSelectField from '@/components/form/SearchableSelectField'
import DateField from '@/components/form/DateField'
import TextAreaField from '@/components/form/TextAreaField'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NumberField,
    TextField,
    SelectField,
    SearchableSelectField,
    OtpField,
    BudgetFrequencyField,
    BudgetStartDayField,
    DateField,
    TextAreaField,
  },
  formComponents: {
    FormButton,
  },
})
