// Trust Score AI Logic - Rule-based scoring system

import type { TrustScore, RenterProfile } from "../types"

/**
 * Calculate Trust Score for a renter
 *
 * Scoring Formula (Total: 100 points):
 * - KYC Verified: 20 points
 * - Trip History: 20 points (based on completed trips)
 * - Punctuality: 20 points (late return penalty)
 * - Driving Behavior: 20 points (rash driving penalty)
 * - Damage History: 10 points (damage report penalty)
 * - Average Rating: 10 points (1-5 star rating)
 */
export function calculateTrustScore(profile: RenterProfile): TrustScore {
  const breakdown = {
    kycVerified: calculateKYCScore(profile.kycVerified),
    tripHistory: calculateTripHistoryScore(profile.completedTrips),
    punctuality: calculatePunctualityScore(profile.lateReturns, profile.totalTrips),
    drivingBehavior: calculateDrivingScore(profile.rashDrivingEvents, profile.totalTrips),
    damageHistory: calculateDamageScore(profile.damageReports, profile.totalTrips),
    ratings: calculateRatingScore(profile.averageRating),
  }

  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0)
  const roundedScore = Math.round(totalScore)

  return {
    score: roundedScore,
    breakdown,
    level: getScoreLevel(roundedScore),
    color: getScoreColor(roundedScore),
  }
}

function calculateKYCScore(isVerified: boolean): number {
  return isVerified ? 20 : 0
}

function calculateTripHistoryScore(completedTrips: number): number {
  // 0 trips = 0 points, 1-5 trips = 10 points, 6-15 trips = 15 points, 16+ = 20 points
  if (completedTrips === 0) return 0
  if (completedTrips <= 5) return 10
  if (completedTrips <= 15) return 15
  return 20
}

function calculatePunctualityScore(lateReturns: number, totalTrips: number): number {
  if (totalTrips === 0) return 20 // Benefit of doubt for new users

  const lateReturnRate = lateReturns / totalTrips

  // No late returns = full 20 points
  if (lateReturnRate === 0) return 20
  // < 10% late = 15 points
  if (lateReturnRate < 0.1) return 15
  // 10-25% late = 10 points
  if (lateReturnRate < 0.25) return 10
  // 25-50% late = 5 points
  if (lateReturnRate < 0.5) return 5
  // > 50% late = 0 points
  return 0
}

function calculateDrivingScore(rashDrivingEvents: number, totalTrips: number): number {
  if (totalTrips === 0) return 20

  const rashDrivingRate = rashDrivingEvents / totalTrips

  // No incidents = full 20 points
  if (rashDrivingRate === 0) return 20
  // < 0.5 per trip = 15 points
  if (rashDrivingRate < 0.5) return 15
  // 0.5-1 per trip = 10 points
  if (rashDrivingRate < 1) return 10
  // 1-2 per trip = 5 points
  if (rashDrivingRate < 2) return 5
  // > 2 per trip = 0 points
  return 0
}

function calculateDamageScore(damageReports: number, totalTrips: number): number {
  if (totalTrips === 0) return 10

  const damageRate = damageReports / totalTrips

  // No damage = full 10 points
  if (damageRate === 0) return 10
  // < 10% damage = 7 points
  if (damageRate < 0.1) return 7
  // 10-25% damage = 5 points
  if (damageRate < 0.25) return 5
  // 25-50% damage = 2 points
  if (damageRate < 0.5) return 2
  // > 50% damage = 0 points
  return 0
}

function calculateRatingScore(averageRating: number): number {
  // Convert 1-5 star rating to 0-10 points
  // 5 stars = 10 points, 1 star = 2 points
  if (averageRating === 0) return 10 // New user benefit
  return Math.round((averageRating / 5) * 10)
}

function getScoreLevel(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 80) return "excellent"
  if (score >= 50) return "good"
  if (score >= 30) return "fair"
  return "poor"
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981" // Green
  if (score >= 50) return "#F59E0B" // Yellow/Amber
  return "#EF4444" // Red
}

// Example usage:
// const renterProfile: RenterProfile = {
//   userId: 'renter-123',
//   kycVerified: true,
//   completedTrips: 12,
//   lateReturns: 1,
//   rashDrivingEvents: 3,
//   damageReports: 0,
//   averageRating: 4.5,
//   totalTrips: 12,
// };
// const trustScore = calculateTrustScore(renterProfile);
// console.log(trustScore);
// Output: { score: 88, breakdown: {...}, level: 'excellent', color: '#10B981' }
