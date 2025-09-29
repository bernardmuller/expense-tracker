import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import AppLayout from '../../AppLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function OnboardingBudgetInfoPage() {
  const navigate = useNavigate()
  const [budgetName, setBudgetName] = useState(`Budget - ${format(new Date(), "dd MMM yyyy")}`)
  const [startingAmount, setStartingAmount] = useState('')

  const handleContinue = () => {
    if (!budgetName.trim() || !startingAmount) {
      return
    }

    const amountNum = parseFloat(startingAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      return
    }

    navigate({
      to: '/onboarding/budget/allocate',
      search: {
        budgetName: budgetName.trim(),
        startingAmount: amountNum,
      }
    })
  }

  return (
    <AppLayout
      title="Set Budget Amount"
      subtitle="Step 2 of 4"
      showBackButton
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="py-4 text-center">
          <div className="text-4xl mb-2">💰</div>
          <p className="text-muted-foreground">
            Set up your budget name and total amount for tracking your expenses.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Budget Name</label>
              <Input
                type="text"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
                placeholder="e.g., January 2024, Monthly Budget"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Starting Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-[8px] text-gray-400 text-md">R</span>
                <Input
                  type="number"
                  value={startingAmount}
                  onChange={(e) => setStartingAmount(e.target.value)}
                  placeholder="120000"
                  className='pl-7'
                />
                <p className="text-sm text-gray-400 mt-2">This will be your total budget amount for the period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleContinue}
          disabled={!budgetName || !startingAmount}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-medium py-3"
        >
          Continue to Allocation
        </Button>
      </div>
    </AppLayout>
  )
}
