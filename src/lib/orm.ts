import { Op } from 'sequelize';

export function startOfToday(curr: Date) {
  return new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());
}

export function pastYear(curr: Date, yearCount = 1) {
  return new Date(curr.getFullYear() - yearCount, curr.getMonth(), curr.getDate());
}

export function pastMonth(curr: Date, monthCount = 1) {
  return new Date(curr.getFullYear(), curr.getMonth() - monthCount, curr.getDate());
}

export function pastWeek(curr: Date, weekCount = 1) {
  return new Date(curr.getTime() - weekCount * 7 * 24 * 60 * 60 * 1000);
}

export function opTimeframe(shorthandTime = '0') {
  const curr = new Date();

  switch (shorthandTime) {
    case '1d':
      return { [Op.between]: [startOfToday(curr), curr] };
    case '1wk':
      return { [Op.between]: [pastWeek(curr), curr] };
    case '2wk':
      return { [Op.between]: [pastWeek(curr, 2), curr] };
    case '1m':
      return { [Op.gte]: pastMonth(curr) };
    case '3m':
      return { [Op.gte]: pastMonth(curr, 3) };
    case '6m':
      return { [Op.gte]: pastMonth(curr, 6) };
    case '1y':
      return { [Op.gte]: pastYear(curr) };
    default:
      return {};
  }
}

// Example usage: where.createdAt = opTimeframe(time);
