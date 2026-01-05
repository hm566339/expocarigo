import React from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import DashboardHeader from "../Header/DashboardHeader"

interface Props {
    navigation: any
    children: React.ReactNode
}

const DashboardLayout: React.FC<Props> = ({
    navigation,
    children,
}) => {
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <DashboardHeader navigation={navigation} />

            {/* BODY */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
})

export default DashboardLayout
