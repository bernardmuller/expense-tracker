import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export type NoneplaceholderProps = {
  headerEmoji: string
  contentText: string
  footerText: string
}

export function NonePlaceholder({
  headerEmoji,
  contentText,
  footerText,
}: NoneplaceholderProps) {
  return (
    <Card className='gap-2'>
      <CardHeader className="text-center">
        <div className="text-4xl">{headerEmoji}</div>
      </CardHeader>
      <CardContent className="text-center">
        <h2 className="text-md font-bold">{contentText}</h2>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground mad-w-60 mx-auto text-sm">
          {footerText}
        </p>
      </CardFooter>
    </Card>
  )
}
