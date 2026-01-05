export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatDateWithTime = (date: string): string => {
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const calculateDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

export const getBookingStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  }
  return statusMap[status] || status
}

export const getKYCStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Not Started",
    SUBMITTED: "Under Review",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  }
  return statusMap[status] || status
}
