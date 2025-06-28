// lib/utils.ts
export function cn(...classes: (string | undefined | false | null)[]) {
    return classes.filter(Boolean).join(' ')
  }
  
export function abbreviate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}
  