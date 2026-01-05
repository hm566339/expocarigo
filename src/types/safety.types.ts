// Safety & Trust feature types

export interface GPSLocation {
  latitude: number
  longitude: number
  timestamp: string
  accuracy?: number
  speed?: number
  heading?: number
}

export interface TrustScore {
  overallScore: number // Out of 100
  tripCount: number
  verifiedDocuments: number
  totalDocuments: number
  onTimePercentage: number
  ratings: {
    average: number
    total: number
  }
  badges: TrustBadge[]
}

export interface TrustBadge {
  id: string
  name: string
  icon: string
  earnedAt: string
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relation: string
}

export interface PreTripPhoto {
  id?: string
  photoUri: string
  photoType: "front" | "back" | "left" | "right" | "dashboard" | "odometer" | "fuel_gauge" | "interior"
  timestamp: string
  notes?: string
}

export interface EmergencySOS {
  id?: string
  userId: string
  bookingId: string
  location: GPSLocation
  timestamp: string
  status: "active" | "resolved" | "cancelled"
  notes?: string
}
