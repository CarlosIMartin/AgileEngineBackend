import { v4 as uuidv4 } from 'uuid';

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function getNewUUID(): string {
  return uuidv4();
}