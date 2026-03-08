import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useVehicleStore } from "../services/storage/store/vehicle.store";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useSearch = () => {
  const { vehicles, fetchVehicles, isLoading, error, clearError } =
    useVehicleStore();

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickingStartDate, setPickingStartDate] = useState(true);
  const [showMap, setShowMap] = useState(true);

  /* ---------- GET USER LOCATION ---------- */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        console.error("Error getting location:", err);
      }
    })();
  }, []);

  /* ---------- DATE FORMATTING ---------- */
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /* ---------- DATE SELECTION ---------- */
  const handleDateSelect = (dateStr: string): void => {
    if (!dateStr) return;

    const displayDate = formatDate(new Date(dateStr));

    if (pickingStartDate) {
      setStartDate(displayDate);
      setPickingStartDate(false);
    } else {
      setEndDate(displayDate);
      setShowDatePicker(false);
    }
  };

  /* ---------- SEARCH ---------- */
  const handleSearch = async (): Promise<void> => {
    clearError();

    if (!city.trim()) {
      console.warn("Please enter a city");
      return;
    }

    console.log("[v0] Searching vehicles for city:", city);
    await fetchVehicles({
      city: city.trim(),
      startDate,
      endDate,
    });
  };

  const openStartDatePicker = () => {
    setPickingStartDate(true);
    setShowDatePicker(true);
  };

  const openEndDatePicker = () => {
    setPickingStartDate(false);
    setShowDatePicker(true);
  };

  return {
    // State
    city,
    startDate,
    endDate,
    location,
    showDatePicker,
    pickingStartDate,
    showMap,
    vehicles,
    isLoading,
    error,

    // Setters
    setCity,
    setShowDatePicker,
    setShowMap,

    // Handlers
    handleDateSelect,
    handleSearch,
    openStartDatePicker,
    openEndDatePicker,
    clearError,
  };
};
