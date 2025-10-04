import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// Bangladesh timezone
const TIMEZONE = 'Asia/Dhaka';

/**
 * Format currency in BDT (Bangladeshi Taka)
 */
export const formatBDT = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format currency in BDT without symbol (for compact display)
 */
export const formatBDTCompact = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Convert UTC date to Bangladesh timezone
 */
export const toBDTime = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(dateObj, TIMEZONE);
};

/**
 * Format date in Bangladesh timezone
 */
export const formatBDDate = (date: Date | string, formatStr: string = 'PPp'): string => {
  const bdDate = toBDTime(date);
  return format(bdDate, formatStr);
};

/**
 * Get start and end of day in Bangladesh timezone
 */
export const getBDDayRange = (date: Date = new Date()) => {
  const bdDate = toBDTime(date);
  const startOfDay = new Date(bdDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(bdDate);
  endOfDay.setHours(23, 59, 59, 999);
  
  return { startOfDay, endOfDay };
};

/**
 * Get date ranges for analytics
 */
export const getDateRanges = () => {
  const now = new Date();
  const bdNow = toBDTime(now);
  
  // Today
  const { startOfDay: todayStart, endOfDay: todayEnd } = getBDDayRange(bdNow);
  
  // This week
  const weekStart = new Date(bdNow);
  weekStart.setDate(bdNow.getDate() - bdNow.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  // This month
  const monthStart = new Date(bdNow.getFullYear(), bdNow.getMonth(), 1);
  
  // This year
  const yearStart = new Date(bdNow.getFullYear(), 0, 1);
  
  return {
    today: { start: todayStart, end: todayEnd },
    week: { start: weekStart, end: bdNow },
    month: { start: monthStart, end: bdNow },
    year: { start: yearStart, end: bdNow },
  };
};
