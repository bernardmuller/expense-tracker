// FormSystem.tsx
import { useForm } from '@tanstack/react-form'
import { createContext, useContext, type ReactNode } from 'react'
import z from 'zod'

const addExpenseFormSchema = z.object({
  description: z
    .string()
    .min(1, 'You must provide a description')
    .max(30, "Description can't exceed 30 characters"),
  amount: z.number().min(1, 'You must provide the amount'),
  category: z.string().refine((val) => val !== '', {
    message: 'You must specify a category',
  }),
})

function myUseForm() {
  return useForm({
    defaultValues: {
      description: '',
      amount: 0,
      category: '',
    },
    validators: {
      onSubmit: addExpenseFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    },
  })
}

type FormInstance = ReturnType<typeof myUseForm>

const FormContext = createContext<FormInstance | null>(null)

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const form = myUseForm()

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>
}

export const useMyFormContext = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useMyFormContext must be used within FormProvider')
  }
  return context
}
