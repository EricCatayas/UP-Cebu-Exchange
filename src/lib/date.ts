export function getDaysRemaining(order: { startDate: Date; endDate: Date }): number {
  const today = new Date();
  const endDate = new Date(order.endDate);
  if (order.startDate > today) {
    return Math.ceil((endDate.getTime() - order.startDate.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    const dayDiff = endDate.getTime() - today.getTime();
    return dayDiff > 0 ? Math.ceil(dayDiff / (1000 * 60 * 60 * 24)) : 0;
  }
}
