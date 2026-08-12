import { differenceInCalendarDays, format, parseISO } from 'date-fns'

export type ShippingUrgency = 'none' | 'default' | 'yellow' | 'orange' | 'overdue'

/** Displays a "YYYY-MM-DD" date value as "DD/MM/YYYY". */
export function formatDateDMY(shippingDate: string | null): string {
  if (!shippingDate) return '—'
  return format(parseISO(shippingDate), 'dd/MM/yyyy')
}

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
  none: 'bg-neutral-50 text-neutral-500 border-neutral-300',
  default: 'bg-neutral-100 text-neutral-700 border-neutral-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
  overdue: 'bg-red-100 text-red-700 border-red-300',
}
