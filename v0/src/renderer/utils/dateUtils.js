// src/renderer/utils/dateUtils.js
// Utility functions for date handling in HB Report
// Use these functions in components to standardize date formatting, parsing, and calculations
// Reference: https://date-fns.org/docs/Getting-Started

import { format, parse, isValid, isSameDay, isBefore, addDays, isMonday, isTuesday, isWednesday, isThursday, isFriday } from 'date-fns';

// Helper function: Calculate business days between two dates (inclusive)
export function businessDaysBetween(start, end) {
  let count = 0;
  let current = new Date(start);
  const endDate = new Date(end);

  while (isSameDay(current, endDate) || isBefore(current, endDate)) {
    if (isMonday(current) || isTuesday(current) || isWednesday(current) || isThursday(current) || isFriday(current)) {
      count++;
    }
    current = addDays(current, 1);
  }

  return count;
}

// Helper function: Format a date to a specified format (default: MM/DD/YYYY)
export function formatDate(date, outputFormat = 'MM/dd/yyyy') {
  if (!date) return null;
  try {
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (!isValid(parsedDate)) throw new Error('Invalid date');
    return format(parsedDate, outputFormat);
  } catch (error) {
    console.error('Invalid date format:', date, error);
    return null;
  }
}

// Helper function: Parse a date string to a Date object
export function parseDate(dateStr, inputFormat = 'MM/dd/yyyy') {
  if (!dateStr) return null;
  try {
    const parsed = parse(dateStr, inputFormat, new Date());
    if (!isValid(parsed)) throw new Error('Invalid date string');
    return parsed;
  } catch (error) {
    console.error('Invalid date string:', dateStr, error);
    return null;
  }
}

// Helper function: Format a date string for display (MM/DD/YYYY)
export function formatForDisplay(dateStr) {
  return formatDate(dateStr, 'MM/dd/yyyy') || '';
}