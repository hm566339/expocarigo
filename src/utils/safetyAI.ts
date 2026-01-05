// Safety & Risk Detection AI Logic

import type { Alert, Location, Trip, GeoFence } from "../types"

export interface VehicleRealTimeData {
  vehicleId: string
  currentSpeed: number // km/h
  currentLocation: Location
  lastGPSUpdate: Date
  tripId?: string
}

export interface SafetyCheckResult {
  alerts: Alert[]
  riskLevel: "none" | "low" | "medium" | "high" | "critical"
}

/**
 * Check for speed limit breaches
 */
export function checkSpeedingViolation(vehicleData: VehicleRealTimeData, speedLimit: number): Alert | null {
  const speedThreshold = speedLimit * 1.2 // 20% over limit triggers alert

  if (vehicleData.currentSpeed > speedThreshold) {
    const severity = vehicleData.currentSpeed > speedLimit * 1.5 ? "high" : "medium"

    return {
      id: `alert-${Date.now()}-speeding`,
      type: "speeding",
      priority: severity === "high" ? "high" : "medium",
      vehicleId: vehicleData.vehicleId,
      tripId: vehicleData.tripId,
      timestamp: new Date(),
      message: `Vehicle exceeding speed limit! Current: ${Math.round(vehicleData.currentSpeed)} km/h, Limit: ${speedLimit} km/h`,
      isRead: false,
      location: vehicleData.currentLocation,
    }
  }

  return null
}

/**
 * Check for geo-fence violations
 * Calculates distance between two lat/lng points using Haversine formula
 */
export function checkGeoFenceViolation(vehicleData: VehicleRealTimeData, geoFence: GeoFence): Alert | null {
  if (!geoFence.isActive) return null

  const distance = calculateDistance(vehicleData.currentLocation, geoFence.center)

  if (distance > geoFence.radiusKm) {
    return {
      id: `alert-${Date.now()}-geofence`,
      type: "geo-fence",
      priority: "high",
      vehicleId: vehicleData.vehicleId,
      tripId: vehicleData.tripId,
      timestamp: new Date(),
      message: `Vehicle outside allowed zone! Distance: ${distance.toFixed(1)} km from center`,
      isRead: false,
      location: vehicleData.currentLocation,
    }
  }

  return null
}

/**
 * Check for theft risk (GPS inactive for > 3 hours)
 */
export function checkTheftRisk(vehicleData: VehicleRealTimeData): Alert | null {
  const now = new Date()
  const lastUpdate = new Date(vehicleData.lastGPSUpdate)
  const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

  if (hoursSinceUpdate > 3) {
    return {
      id: `alert-${Date.now()}-theft`,
      type: "theft",
      priority: "critical",
      vehicleId: vehicleData.vehicleId,
      tripId: vehicleData.tripId,
      timestamp: new Date(),
      message: `Theft Risk: GPS inactive for ${Math.round(hoursSinceUpdate)} hours`,
      isRead: false,
      location: vehicleData.currentLocation,
    }
  }

  return null
}

/**
 * Check for late return
 */
export function checkLateReturn(trip: Trip): Alert | null {
  if (trip.status !== "active") return null

  const now = new Date()
  const endDate = new Date(trip.endDate)

  if (now > endDate) {
    const hoursLate = (now.getTime() - endDate.getTime()) / (1000 * 60 * 60)

    return {
      id: `alert-${Date.now()}-late`,
      type: "late-return",
      priority: hoursLate > 24 ? "high" : "medium",
      vehicleId: trip.vehicleId,
      tripId: trip.id,
      timestamp: new Date(),
      message: `Vehicle not returned! ${Math.round(hoursLate)} hours overdue`,
      isRead: false,
    }
  }

  return null
}

/**
 * Run all safety checks for a vehicle
 */
export function runSafetyChecks(
  vehicleData: VehicleRealTimeData,
  trip: Trip | null,
  geoFence: GeoFence | null,
  speedLimit: number,
): SafetyCheckResult {
  const alerts: Alert[] = []

  // Check theft risk (highest priority)
  const theftAlert = checkTheftRisk(vehicleData)
  if (theftAlert) alerts.push(theftAlert)

  // Check speeding
  const speedingAlert = checkSpeedingViolation(vehicleData, speedLimit)
  if (speedingAlert) alerts.push(speedingAlert)

  // Check geo-fence
  if (geoFence) {
    const geoFenceAlert = checkGeoFenceViolation(vehicleData, geoFence)
    if (geoFenceAlert) alerts.push(geoFenceAlert)
  }

  // Check late return
  if (trip) {
    const lateReturnAlert = checkLateReturn(trip)
    if (lateReturnAlert) alerts.push(lateReturnAlert)
  }

  // Sort by priority
  alerts.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // Determine overall risk level
  const riskLevel = determineRiskLevel(alerts)

  return { alerts, riskLevel }
}

function determineRiskLevel(alerts: Alert[]): "none" | "low" | "medium" | "high" | "critical" {
  if (alerts.length === 0) return "none"

  if (alerts.some((a) => a.priority === "critical")) return "critical"
  if (alerts.some((a) => a.priority === "high")) return "high"
  if (alerts.some((a) => a.priority === "medium")) return "medium"
  return "low"
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(loc2.latitude - loc1.latitude)
  const dLon = toRad(loc2.longitude - loc1.longitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
