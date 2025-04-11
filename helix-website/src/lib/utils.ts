import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSnakeCase(str: string): string {
  console.log("ENIUNFEIUNFE", str)
  let result = str.replace(/\s+/g, '_');
  // Handle consecutive capitals differently than single capitals
  result = result.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2'); // Break after consecutive caps
  result = result.replace(/([a-z])([A-Z])/g, '$1_$2'); // Break between lower and upper
  result = result.toLowerCase();
  const sanitized = result.replace(/[^a-zA-Z0-9_-]/g, '');
  const finalResult = sanitized.replace(/\+/g, '');

  if (finalResult.length === 0) {
    throw new Error(`Invalid name: ${str}`)
  }
  return finalResult
}
