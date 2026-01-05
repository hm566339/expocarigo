import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import PaymentScreen from "../screens/renters/booking/PaymentScreen"
import { default as BookingsScreen, default as BookingSummaryScreen } from "../screens/renters/bookings/BookingsScreen"
import CarDetailScreen from "../screens/renters/cars/CarDetailScreen"
import HomeScreen from "../screens/renters/home/HomeScreen"
import RateOwnerScreen from "../screens/renters/rating/RateOwnerScreen"
import SearchScreen from "../screens/renters/search/SearchScreen"
import ActiveTripScreen from "../screens/renters/trip/ActiveTripScreen"
import ExtendTripScreen from "../screens/renters/trip/ExtendTripScreen"
import TripEndScreen from "../screens/renters/trip/TripEndScreen"
import ProfileScreen from "../shared/ProfileScreen"
import type { HomeTabsParamList, MainStackParamList } from "./types"

const Stack = createNativeStackNavigator<MainStackParamList>()
const Tab = createBottomTabNavigator<HomeTabsParamList>()

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = "home"
          if (route.name === "Home") iconName = "home"
          else if (route.name === "Search") iconName = "search"
          else if (route.name === "Bookings") iconName = "calendar"
          else if (route.name === "Profile") iconName = "person"

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#888",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: "Search" }} />
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ title: "My Bookings" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  )
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} options={{ animationEnabled: true }} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} options={{ animationEnabled: true }} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ animationEnabled: true }} />
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ animationEnabled: true }} />
      <Stack.Screen name="TripEnd" component={TripEndScreen} options={{ animationEnabled: true }} />
      <Stack.Screen name="ExtendTrip" component={ExtendTripScreen} options={{ animationEnabled: true }} />
      <Stack.Screen name="RateOwner" component={RateOwnerScreen} options={{ animationEnabled: true }} />
    </Stack.Navigator>
  )
}
