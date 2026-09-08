import { Repeat } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface Props {
  children: React.ReactNode
  paidCount: number
  unpaidCount: number
  dueTodayCount: number
  defaultExpanded?: boolean
}

export default function RecurringExpensesCard({
  children,
  paidCount,
  unpaidCount,
  dueTodayCount,
  defaultExpanded,
}: Props) {
  return (
    <Card className="p-0">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultExpanded ? 'recurring' : undefined}
      >
        <AccordionItem value="recurring" className="border-b-0">
          <AccordionTrigger className="px-6 pr-9 py-4 hover:no-underline">
            <div className="flex flex-1 items-center gap-3 pr-2">
              <div className="bg-primary flex items-center justify-center rounded-md p-2">
                <Repeat className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-1 flex-col text-left">
                <span className="text-foreground font-grotesk font-semibold">
                  Recurring Expenses
                </span>
                <span className="text-muted-foreground text-sm">
                  {paidCount} paid · {unpaidCount} due
                </span>
              </div>
              {dueTodayCount > 0 && (
                <Badge variant="default">{dueTodayCount} due today</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pt-2">
            <ul className="divide-border divide-y">{children}</ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}
