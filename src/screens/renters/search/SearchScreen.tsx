import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { CalendarPicker } from "../../../components/search/CalendarPicker";
import { MapSection } from "../../../components/search/MapSection";
import { SearchHeader } from "../../../components/search/SearchHeader";
import { VehicleList } from "../../../components/search/VehicleList";
import { useSearch } from "../../../hooks/useSearch";
import { useSearchAnimations } from "../../../hooks/useSearchAnimations";

interface SearchScreenProps {
  navigation: any;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const {
    city,
    startDate,
    endDate,
    location,
    showDatePicker,
    showMap,
    vehicles,
    isLoading,
    error,
    setCity,
    setShowDatePicker,
    setShowMap,
    handleDateSelect,
    handleSearch,
    openStartDatePicker,
    openEndDatePicker,
    clearError,
  } = useSearch();

  const { fadeAnim, slideAnim, scaleAnim, triggerCardPressAnimation } =
    useSearchAnimations();

  const handleVehiclePress = (vehicle: any) => {
    triggerCardPressAnimation(() => {
      navigation.navigate("CarDetail", { vehicleId: vehicle.vehicleId });
    });
  };

  return (
    <View style={styles.container}>
      {/* SEARCH HEADER WITH FILTERS */}
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
        ]}
      >
        <SearchHeader
          city={city}
          onCityChange={setCity}
          startDate={startDate}
          endDate={endDate}
          onStartDatePress={openStartDatePicker}
          onEndDatePress={openEndDatePicker}
          onSearch={handleSearch}
          onMapToggle={() => setShowMap(!showMap)}
          isLoading={isLoading}
          showMap={showMap}
          hasLocation={!!location}
          error={error}
          onErrorClose={clearError}
        />
      </Animated.View>

      {/* CALENDAR PICKER MODAL */}
      <CalendarPicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={handleDateSelect}
      />

      {/* MAP SECTION */}
      {showMap && (
        <MapSection
          location={location}
          vehicles={vehicles}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
        />
      )}

      {/* VEHICLE LIST */}
      <VehicleList
        vehicles={vehicles}
        isLoading={isLoading}
        city={city}
        onVehiclePress={handleVehiclePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});
