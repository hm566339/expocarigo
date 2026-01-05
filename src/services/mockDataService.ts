// Mock Data Service - Generate realistic test data

import type { User, Vehicle, Trip, Alert, RenterProfile, GeoFence, VehicleRealTimeData } from "../types"

/**
 * Mock Owner User
 */
export const mockOwner: User = {
  id: "owner-001",
  name: "Rajesh Kumar",
  email: "rajesh@carigo.com",
  phone: "+91-9876543210",
  role: "owner",
  kycVerified: true,
  createdAt: new Date("2024-01-15"),
  profileImage: "https://i.pravatar.cc/150?img=12",
}

/**
 * Mock Renter User
 */
export const mockRenter: User = {
  id: "renter-001",
  name: "Priya Sharma",
  email: "priya@gmail.com",
  phone: "+91-9123456789",
  role: "renter",
  kycVerified: true,
  createdAt: new Date("2024-03-20"),
  profileImage: "https://i.pravatar.cc/150?img=5",
}

/**
 * Mock Vehicles
 */
export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-001",
    ownerId: "owner-001",
    name: "Honda City",
    model: "VX CVT",
    year: 2023,
    licensePlate: "KA-05-MN-1234",
    pricePerDay: 2500,
    currentLocation: {
      latitude: 12.9716,
      longitude: 77.5946,
      address: "Koramangala, Bangalore",
    },
    status: "in-trip",
    features: ["AC", "GPS", "Music System", "Sunroof"],
    imageUrl: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter.jpeg",
  },
  {
    id: "vehicle-002",
    ownerId: "owner-001",
    name: "Maruti Swift",
    model: "VXI",
    year: 2022,
    licensePlate: "KA-01-AB-5678",
    pricePerDay: 1800,
    currentLocation: {
      latitude: 12.9352,
      longitude: 77.6245,
      address: "Indiranagar, Bangalore",
    },
    status: "available",
    features: ["AC", "GPS", "Music System"],
  },
]

/**
 * Mock Trips
 */
export const mockTrips: Trip[] = [
  {
    id: "trip-001",
    vehicleId: "vehicle-001",
    renterId: "renter-001",
    ownerId: "owner-001",
    startDate: new Date("2025-01-20T09:00:00"),
    endDate: new Date("2025-01-22T18:00:00"),
    status: "active",
    totalAmount: 5000,
    incidents: [
      {
        type: "speeding",
        timestamp: new Date("2025-01-21T14:30:00"),
        severity: "medium",
        description: "Speed exceeded 85 km/h in 60 km/h zone",
        location: { latitude: 12.9716, longitude: 77.5946 },
      },
    ],
  },
  {
    id: "trip-002",
    vehicleId: "vehicle-001",
    renterId: "renter-001",
    ownerId: "owner-001",
    startDate: new Date("2025-01-15T10:00:00"),
    endDate: new Date("2025-01-17T10:00:00"),
    actualEndDate: new Date("2025-01-17T09:30:00"),
    status: "completed",
    totalAmount: 5000,
    renterRating: 5,
    ownerRating: 4.5,
    incidents: [],
  },
  {
    id: "trip-003",
    vehicleId: "vehicle-002",
    renterId: "renter-002",
    ownerId: "owner-001",
    startDate: new Date("2025-01-18T08:00:00"),
    endDate: new Date("2025-01-20T20:00:00"),
    actualEndDate: new Date("2025-01-20T19:45:00"),
    status: "completed",
    totalAmount: 3600,
    renterRating: 4,
    ownerRating: 4,
    incidents: [],
  },
]

/**
 * Mock Alerts for Owner Dashboard
 */
export const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    type: "speeding",
    priority: "medium",
    vehicleId: "vehicle-001",
    tripId: "trip-001",
    timestamp: new Date("2025-01-21T14:30:00"),
    message: "Honda City exceeding speed limit! Current: 85 km/h",
    isRead: false,
    location: { latitude: 12.9716, longitude: 77.5946 },
  },
  {
    id: "alert-002",
    type: "geo-fence",
    priority: "high",
    vehicleId: "vehicle-001",
    tripId: "trip-001",
    timestamp: new Date("2025-01-21T16:45:00"),
    message: "Vehicle outside allowed zone! Distance: 12.3 km from center",
    isRead: false,
  },
]

/**
 * Mock Renter Profile for Trust Score
 */
export const mockRenterProfile: RenterProfile = {
  userId: "renter-001",
  kycVerified: true,
  completedTrips: 12,
  lateReturns: 1,
  rashDrivingEvents: 3,
  damageReports: 0,
  averageRating: 4.5,
  totalTrips: 12,
}

/**
 * Mock Real-time Vehicle Data
 */
export const mockVehicleRealTimeData: VehicleRealTimeData = {
  vehicleId: "vehicle-001",
  currentSpeed: 75,
  currentLocation: {
    latitude: 12.9716,
    longitude: 77.5946,
    address: "Koramangala, Bangalore",
  },
  lastGPSUpdate: new Date(),
  tripId: "trip-001",
}

/**
 * Mock Geo-fence
 */
export const mockGeoFence: GeoFence = {
  id: "geofence-001",
  vehicleId: "vehicle-001",
  center: {
    latitude: 12.9716,
    longitude: 77.5946,
  },
  radiusKm: 50,
  isActive: true,
}

/**
 * Generate additional completed trips for earnings calculation
 */
export function generateMockTripsForEarnings(ownerId: string): Trip[] {
  const trips: Trip[] = []
  const now = new Date()

  // Generate 20 random completed trips over the past 6 months
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 180) // Random day in last 6 months
    const endDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
    const startDate = new Date(endDate.getTime() - 2 * 24 * 60 * 60 * 1000) // 2-day trip

    trips.push({
      id: `trip-${100 + i}`,
      vehicleId: `vehicle-00${(i % 2) + 1}`,
      renterId: `renter-00${(i % 3) + 1}`,
      ownerId,
      startDate,
      endDate,
      actualEndDate: endDate,
      status: "completed",
      totalAmount: Math.floor(Math.random() * 3000) + 2000, // Random amount 2000-5000
      renterRating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      ownerRating: Math.floor(Math.random() * 2) + 4,
      incidents: [],
    })
  }

  return trips
}
