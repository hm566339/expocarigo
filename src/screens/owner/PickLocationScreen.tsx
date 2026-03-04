import * as Location from "expo-location"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import MapView, { Marker } from "react-native-maps"
import { Button } from "../../components/ui/Button"

export default function PickLocationScreen({ route, navigation }: any) {
    const { location, onSelect } = route.params

    const DEFAULT_LOCATION = {
        latitude: 28.6139,
        longitude: 77.209,
    }

    const [selectedLocation, setSelectedLocation] = useState(
        location ?? DEFAULT_LOCATION
    )
    const [addressData, setAddressData] = useState<any>(null)

    useEffect(() => {
        ; (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync()
            if (status !== "granted") return

            const current = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            })

            const coords = {
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
            }

            setSelectedLocation(coords)
            fetchAddress(coords)
        })()
    }, [])

    const fetchAddress = async (coords: {
        latitude: number
        longitude: number
    }) => {
        try {
            const res = await Location.reverseGeocodeAsync(coords)
            if (res.length > 0) {
                const a = res[0]
                setAddressData({
                    address: `${a.name ?? ""} ${a.street ?? ""}, ${a.city ?? ""}, ${a.region ?? ""
                        } ${a.postalCode ?? ""}, ${a.country ?? ""}`.trim(),
                    city: a.city,
                    state: a.region,
                    country: a.country,
                    postalCode: a.postalCode,
                })
            }
        } catch { }
    }

    const handleSave = () => {
        onSelect({
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            ...addressData,
        })
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    draggable
                    coordinate={selectedLocation}
                    onDragEnd={e => {
                        const coord = e.nativeEvent.coordinate
                        setSelectedLocation(coord)
                        fetchAddress(coord)
                    }}
                />
            </MapView>

            <View style={styles.footer}>
                <Button title="Save Location" onPress={handleSave} fullWidth />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    footer: {
        padding: 16,
        backgroundColor: "#fff",
    },
})
