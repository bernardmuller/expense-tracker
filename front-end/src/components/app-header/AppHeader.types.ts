import type { ReactNode } from 'react'

export type RootProps = {
  children: ReactNode
  className?: string
}

export type ContentProps = {
  children: ReactNode
  className?: string
}

export type IconProps = {
  src: string
  alt: string
  className?: string
}

export type InfoProps = {
  appName: string
  message: string
  className?: string
}

export type ActionProps = {
  children: ReactNode
  className?: string
}

export type BackProps = {
  onBack: () => void
  label?: string
  className?: string
}

export type LeftProps = {
  children: ReactNode
  className?: string
}

export type CenterProps = {
  children: ReactNode
  className?: string
}

export type RightProps = {
  children: ReactNode
  className?: string
}

export type TitleProps = {
  children: ReactNode
  className?: string
}
