import { differenceInCalendarDays, parseISO } from 'date-fns'

export type ShippingUrgency = 'none' | 'default' | 'yellow' | 'orange' | 'overdue'

export interface ShippingDateInfo {
  daysLeft: number | null
  urgency: ShippingUrgency
  label: string
}

/**
 * >5 days left -> default/white, 3-5 -> yellow, 1-2 -> orange, <=0 -> red "Quá hạn N ngày"
 */
export function getShippingDateInfo(shippingDate: string | null): ShippingDateInfo {
  if (!shippingDate) {
    return { daysLeft: null, urgency: 'none', label: 'Chưa đặt lịch' }
  }

  const daysLeft = differenceInCalendarDays(parseISO(shippingDate), new Date())

  if (daysLeft > 5) {
    return { daysLeft, urgency: 'default', label: `Còn ${daysLeft} ngày` }
  }
  if (daysLeft >= 3) {
    return { daysLeft, urgency: 'yellow', label: `Còn ${daysLeft} ngày` }
  }
  if (daysLeft >= 1) {
    return { daysLeft, urgency: 'orange', label: `Còn ${daysLeft} ngày` }
  }
  if (daysLeft === 0) {
    return { daysLeft, urgency: 'overdue', label: 'Ship hôm nay' }
  }
  return { daysLeft, urgency: 'overdue', label: `Quá hạn ${Math.abs(daysLeft)} ngày` }
}

/** Lower rank sorts first — overdue always floats to the top. */
export const urgencyRank: Record<ShippingUrgency, number> = {
  overdue: 0,
  orange: 1,
  yellow: 2,
  default: 3,
  none: 4,
}

export const urgencyClasses: Record<ShippingUrgency, string> = {
  none: 'bg-white/5 text-white/50 border-white/10',
  default: 'bg-white/10 text-white border-white/20',
  yellow: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  overdue: 'bg-red-500/20 text-red-300 border-red-500/40',
}
