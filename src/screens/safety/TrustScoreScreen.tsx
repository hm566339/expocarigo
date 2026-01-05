"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native"
import { useRoute } from "@react-navigation/native"
import type { TrustScore } from "../../types/safety.types"

const TrustScoreScreen: React.FC = () => {
  const route = useRoute()
  const { userId } = route.params as { userId: string }

  const [loading, setLoading] = useState(true)

  // Mock trust score data (replace with actual API call)
  const [trustScore] = useState<TrustScore>({
    overallScore: 87,
    tripCount: 42,
    verifiedDocuments: 4,
    totalDocuments: 4,
    onTimePercentage: 95,
    ratings: {
      average: 4.6,
      total: 38,
    },
    badges: [
      {
        id: "1",
        name: "Verified Driver",
        icon: "✓",
        earnedAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Top Rated",
        icon: "⭐",
        earnedAt: "2024-02-20",
      },
      {
        id: "3",
        name: "Punctual Pro",
        icon: "⏰",
        earnedAt: "2024-03-10",
      },
    ],
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4caf50"
    if (score >= 60) return "#ff9800"
    return "#f44336"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Trust Score Hero */}
      <View style={styles.heroSection}>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor(trustScore.overallScore) }]}>
          <Text style={[styles.scoreNumber, { color: getScoreColor(trustScore.overallScore) }]}>
            {trustScore.overallScore}
          </Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <Text style={styles.scoreLabel}>{getScoreLabel(trustScore.overallScore)}</Text>
        <Text style={styles.scoreSubtext}>Trust Score</Text>
      </View>

      {/* Score Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Score Breakdown</Text>

        <ScoreMetric
          label="Verified Documents"
          value={`${trustScore.verifiedDocuments}/${trustScore.totalDocuments}`}
          icon="📄"
          percentage={(trustScore.verifiedDocuments / trustScore.totalDocuments) * 100}
        />

        <ScoreMetric
          label="Completed Trips"
          value={trustScore.tripCount.toString()}
          icon="🚗"
          percentage={Math.min((trustScore.tripCount / 50) * 100, 100)}
        />

        <ScoreMetric
          label="On-Time Pickup"
          value={`${trustScore.onTimePercentage}%`}
          icon="⏰"
          percentage={trustScore.onTimePercentage}
        />

        <ScoreMetric
          label="Average Rating"
          value={`${trustScore.ratings.average}/5.0`}
          icon="⭐"
          percentage={(trustScore.ratings.average / 5) * 100}
        />
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earned Badges</Text>
        <View style={styles.badgesGrid}>
          {trustScore.badges.map((badge) => (
            <View key={badge.id} style={styles.badgeCard}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDate}>{new Date(badge.earnedAt).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Trust Factors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Builds Trust?</Text>
        <TrustFactor
          title="Complete Your Profile"
          description="Upload all required documents and verify your identity"
          completed
        />
        <TrustFactor
          title="Maintain Good Ratings"
          description="Provide excellent service to earn 5-star reviews"
          completed
        />
        <TrustFactor title="Be Punctual" description="Pick up and return vehicles on time" completed />
        <TrustFactor
          title="Complete More Trips"
          description="Build your rental history with successful trips"
          completed={false}
        />
      </View>
    </ScrollView>
  )
}

const ScoreMetric: React.FC<{
  label: string
  value: string
  icon: string
  percentage: number
}> = ({ label, value, icon, percentage }) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <View style={styles.metricIcon}>
        <Text style={styles.metricIconText}>{icon}</Text>
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${percentage}%`,
            backgroundColor: percentage >= 80 ? "#4caf50" : percentage >= 60 ? "#ff9800" : "#f44336",
          },
        ]}
      />
    </View>
  </View>
)

const TrustFactor: React.FC<{
  title: string
  description: string
  completed: boolean
}> = ({ title, description, completed }) => (
  <View style={styles.trustFactorCard}>
    <View style={styles.trustFactorIcon}>
      <Text style={styles.trustFactorIconText}>{completed ? "✓" : "○"}</Text>
    </View>
    <View style={styles.trustFactorContent}>
      <Text style={styles.trustFactorTitle}>{title}</Text>
      <Text style={styles.trustFactorDescription}>{description}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    backgroundColor: "#fff",
    padding: 40,
    alignItems: "center",
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: "700",
  },
  scoreMax: {
    fontSize: 20,
    color: "#9e9e9e",
    fontWeight: "600",
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 16,
    color: "#757575",
  },
  section: {
    marginTop: 16,
    backgroundColor: "#fff",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 16,
  },
  metricCard: {
    marginBottom: 20,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  metricIconText: {
    fontSize: 24,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  badgeCard: {
    width: "30%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#212121",
    textAlign: "center",
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
    color: "#9e9e9e",
  },
  trustFactorCard: {
    flexDirection: "row",
    marginBottom: 16,
  },
  trustFactorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  trustFactorIconText: {
    fontSize: 18,
    color: "#4caf50",
    fontWeight: "700",
  },
  trustFactorContent: {
    flex: 1,
  },
  trustFactorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  trustFactorDescription: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
})

export default TrustScoreScreen
