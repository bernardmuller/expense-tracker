import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { LinkTrigger } from '@/components/ui/link-trigger'
import type { NavigateOptions } from '@tanstack/react-router'

export function Root({ children }: { children: React.ReactNode }) {
  return <Card>{children}</Card>
}

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <CardHeader className="flex items-start justify-between">
      {children}
    </CardHeader>
  )
}

export function Content({ children }: { children: React.ReactNode }) {
  return <CardContent>{children}</CardContent>
}

export function Footer({ children }: { children: React.ReactNode }) {
  return <CardFooter>{children}</CardFooter>
}

export function Title({ budgetName }: { budgetName: string }) {
  return (
    <div>
      <CardTitle>Current Budget</CardTitle>
      <p className="text-muted-foreground text-sm">{budgetName}</p>
    </div>
  )
}

export function ViewTrigger({ url }: { url: NavigateOptions['to'] }) {
  return (
    <Button variant="link" className="h-auto p-0 text-sm" asChild>
      <LinkTrigger url={url}>View</LinkTrigger>
    </Button>
  )
}

export function HideTrigger({
  children,
  handleClick,
}: {
  children: React.ReactNode
  handleClick: () => void
}) {
  return (
    <Button variant="ghost" onClick={handleClick}>
      {children}
    </Button>
  )
}

export function CurrentAmount({ amount }: { amount: string }) {
  return <span className="text-primary text-4xl font-bold">{amount}</span>
}

export function RemainingAmount({ amount }: { amount: string }) {
  return (
    <span className="text-muted-foreground text-sm">remaining of {amount}</span>
  )
}

export function SpentAmount({ amount }: { amount: string }) {
  return <span className="text-muted-foreground">{amount}</span>
}

export function SpentPercentage({ percentage }: { percentage: number }) {
  return <span className="text-muted-foreground">%{percentage}</span>
}
