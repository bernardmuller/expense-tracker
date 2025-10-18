import { Card, CardContent } from '@/components/ui/card'

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 text-center">
        {children}
      </CardContent>
    </Card>
  )
}

export function Header({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Content({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Footer({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Emoji({ emoji }: { emoji: string }) {
  return <div className="text-4xl">{emoji}</div>
}

export function BoldText({ text }: { text: string }) {
  return <h2 className="text-md font-bold">{text}</h2>
}

export function MutedText({ text }: { text: string }) {
  return (
    <p className="text-muted-foreground mad-w-60 mx-auto text-sm">{text}</p>
  )
}
