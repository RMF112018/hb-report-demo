import moment from 'moment';

// Helper function: Calculate business days between two dates (inclusive)
export default function businessDaysBetween(start, end) {
    let count = 0;
    let current = moment(start);
    while (current.isSameOrBefore(end, 'day')) {
      if (current.isoWeekday() <= 5) { // Monday to Friday
        count++;
      }
      current.add(1, 'day');
    }
    return count;
  }