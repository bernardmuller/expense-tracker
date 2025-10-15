import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewBudgetModal() {
  return (
    <Dialog open={true}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Budget</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budgetName">Budget Name</Label>
            <Input
              type="text"
              id="budgetName"
              placeholder="e.g., January 2024, Monthly Budget"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startAmount">Starting Amount</Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-2 left-3">
                R
              </span>
              <Input
                type="number"
                id="startAmount"
                placeholder="0.00"
                step="0.01"
                min="0"
                className="pl-8"
                required
              />
            </div>
            <p className="text-muted-foreground text-xs">
              This will be your total budget amount for the period
            </p>
          </div>

          {/* {mutation.error && (
            <div
              className="bg-destructive/5 border-destructive/50 rounded-md
                border p-3"
            >
              <p className="text-destructive text-sm">
                Failed to create budget. Please try again.
              </p>
            </div>
          )} */}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
            {/* <Button
              type="submit"
              className="flex-1"
            >
              {mutation.isPending ? (
                <>
                  <div
                    className="border-primary-foreground mr-2 h-4 w-4
                      animate-spin rounded-full border-2 border-t-transparent"
                  ></div>
                  Creating...
                </>
              ) : (
                'Start new budget'
              )}
            </Button> */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
