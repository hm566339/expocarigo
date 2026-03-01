import { View } from "react-native";

export const AllVehicles = () => {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        All Vehicles
      </Text>
      {/* Placeholder for vehicle list */}
      <Text>Vehicle 1</Text>
      <Text>Vehicle 2</Text>
      <Text>Vehicle 3</Text>
    </View>
  );
};
