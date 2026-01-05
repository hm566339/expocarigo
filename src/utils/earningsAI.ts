// Earnings Summary AI Logic

import type { Trip, EarningsSummary, MonthlyEarning } from "../types"

/**
 * Calculate earnings summary for an owner
 */
export function calculateEarnings(trips: Trip[], ownerId: string): EarningsSummary {
  const ownerTrips = trips.filter((t) => t.ownerId === ownerId && t.status === "completed")

  const now = new Date()
  const todayTrips = ownerTrips.filter((t) => isSameDay(new Date(t.actualEndDate!), now))
  const weekTrips = ownerTrips.filter((t) => isWithinDays(new Date(t.actualEndDate!), now, 7))
  const monthTrips = ownerTrips.filter((t) => isSameMonth(new Date(t.actualEndDate!), now))
  const yearTrips = ownerTrips.filter((t) => isSameYear(new Date(t.actualEndDate!), now))

  const activeTrips = trips.filter((t) => t.ownerId === ownerId && t.status === "active").length

  return {
    today: sumEarnings(todayTrips),
    week: sumEarnings(weekTrips),
    month: sumEarnings(monthTrips),
    year: sumEarnings(yearTrips),
    activeTrips,
    totalTrips: ownerTrips.length,
    monthlyData: calculateMonthlyEarnings(ownerTrips),
  }
}

function sumEarnings(trips: Trip[]): number {
  return trips.reduce((sum, trip) => sum + trip.totalAmount, 0)
}

/**
 * Calculate monthly earnings for the past 6 months
 */
function calculateMonthlyEarnings(trips: Trip[]): MonthlyEarning[] {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  const monthlyData: MonthlyEarning[] = []

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthTrips = trips.filter((t) => isSameMonth(new Date(t.actualEndDate!), targetDate))

    monthlyData.push({
      month: monthNames[targetDate.getMonth()],
      earnings: sumEarnings(monthTrips),
    })
  }

  return monthlyData
}

// Date helper functions
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isWithinDays(date1: Date, date2: Date, days: number): boolean {
  const diffMs = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= days
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
}

function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear()
}
