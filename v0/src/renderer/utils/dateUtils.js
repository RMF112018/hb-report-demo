// src/renderer/utils/dateUtils.js
// Utility functions for date handling in HB Report
// Use these functions in components to standardize date formatting, parsing, and calculations
// Reference: https://date-fns.org/docs/Getting-Started
// *Additional Reference*: https://day.js.org/docs/en/parse/parse

import { format, parse, isValid, isSameDay, isBefore, addDays, isMonday, isTuesday, isWednesday, isThursday, isFriday } from 'date-fns';
import dayjs from 'dayjs';

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
export function formatDate(date, outputFormat = 'MM/DD/YYYY') {
  if (!date) return null;
  try {
    if (dayjs.isDayjs(date)) {
      return date.format(outputFormat);
    }
    const parsedDate = date instanceof Date ? date : new Date(date);
    if (!isValid(parsedDate)) throw new Error('Invalid date');
    return format(parsedDate, outputFormat.replace('YYYY', 'yyyy').replace('DD', 'dd'));
  } catch (error) {
    console.error('Invalid date format:', date, error);
    return null;
  }
}

// Helper function: Parse a date string or Day.js object to a Date object
export function parseDate(dateInput, inputFormat = 'MM/DD/YYYY') {
  if (!dateInput) return null;
  try {
    if (dayjs.isDayjs(dateInput)) {
      const date = dateInput.toDate();
      if (!isValid(date)) throw new Error('Invalid Day.js date');
      return date;
    }
    if (typeof dateInput !== 'string') {
      console.warn('parseDate: Expected string or Day.js object, got:', typeof dateInput, dateInput);
      return null;
    }
    const parsed = parse(dateInput, inputFormat, new Date());
    if (!isValid(parsed)) throw new Error('Invalid date string');
    return parsed;
  } catch (error) {
    console.error('Invalid date input:', dateInput, error);
    return null;
  }
}

// Helper function: Format a date string for display (MM/DD/YYYY)
export function formatForDisplay(dateInput) {
  return formatDate(dateInput, 'MM/DD/YYYY') || '';
}