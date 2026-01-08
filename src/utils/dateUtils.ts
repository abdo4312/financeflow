import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO, eachDayOfInterval, format } from 'date-fns';
import type { Transaction } from '../types';

export type TimeRange = 'week' | 'month' | 'year';

export const filterTransactionsByDate = (transactions: Transaction[], range: TimeRange) => {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (range) {
    case 'week':
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case 'year':
      start = startOfYear(now);
      end = endOfYear(now);
      break;
  }

  return {
    transactions: transactions.filter(t => isWithinInterval(parseISO(t.date), { start, end })),
    start,
    end
  };
};

export const getChartData = (transactions: Transaction[], range: TimeRange) => {
  const { transactions: filtered, start, end } = filterTransactionsByDate(transactions, range);
  
  // Create an array of all days in the range to ensure continuous chart
  // For year view, we might want to aggregate by month instead of day to avoid too many points
  if (range === 'year') {
    // Aggregate by month for year view
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(new Date().getFullYear(), i, 1);
      return {
        date: d,
        name: format(d, 'MMM'),
        income: 0,
        expense: 0
      };
    });

    filtered.forEach(t => {
      const date = parseISO(t.date);
      const monthIndex = date.getMonth();
      if (t.type === 'income') {
        months[monthIndex].income += t.amount;
      } else {
        months[monthIndex].expense += t.amount;
      }
    });

    return months;
  } else {
    // Aggregate by day for week/month view
    const days = eachDayOfInterval({ start, end }).map(date => ({
      date,
      name: format(date, range === 'week' ? 'EEE' : 'dd MMM'),
      income: 0,
      expense: 0
    }));

    filtered.forEach(t => {
      const tDate = parseISO(t.date);
      const dayIndex = days.findIndex(d => 
        format(d.date, 'yyyy-MM-dd') === format(tDate, 'yyyy-MM-dd')
      );
      if (dayIndex !== -1) {
        if (t.type === 'income') {
          days[dayIndex].income += t.amount;
        } else {
          days[dayIndex].expense += t.amount;
        }
      }
    });

    return days;
  }
};
