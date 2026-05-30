import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBookingRef(): string {
  const date = new Date();
  const year = date.getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VB-${year}-${randomStr}`;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function createGoogleCalendarUrl(booking: {
  title: string;
  startDate: Date;
  durationMinutes: number;
  description: string;
  location: string;
}): string {
  const { title, startDate, durationMinutes, description, location } = booking;
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: description,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
