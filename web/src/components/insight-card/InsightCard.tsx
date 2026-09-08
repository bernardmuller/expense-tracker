import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type InsightCardProps = {
  title: string
  value: string
}

export function InsightCard({ title, value }: InsightCardProps) {
  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
