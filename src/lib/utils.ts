import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
