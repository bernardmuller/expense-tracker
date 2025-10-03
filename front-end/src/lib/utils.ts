import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type {ClassValue} from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getRandomBool() {
  return Math.random() < 0.5
}
