import React, { useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    Modal,
    TouchableOpacity,
} from "react-native"
import { useAuth } from "../../context/AuthContext"

interface HeaderProps {
    navigation: any
}

const DashboardHeader: React.FC<HeaderProps> = ({ navigation }) => {
    const { user, logout } = useAuth()
    const [menuVisible, setMenuVisible] = useState(false)

    return (
        <View style={styles.header}>
            {/* LEFT */}
            <View>
                <Text style={styles.greeting}>Hello 👋</Text>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.subtitle}>Welcome back to CARIGO</Text>
            </View>

            {/* RIGHT */}
            <Pressable onPress={() => setMenuVisible(true)}>
                <Image
                    source={{
                        uri:
                            user?.profilepictureUrl ??
                            "https://i.pravatar.cc/150",
                    }}
                    style={styles.avatar}
                />
            </Pressable>

            {/* MENU */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menu}>
                        <MenuItem
                            label="View Profile"
                            onPress={() => {
                                setMenuVisible(false)
                                navigation.navigate("search", {
                                    screen: "OwnerProfile",
                                })
                            }}
                        />

                        <MenuItem
                            label="Edit Profile"
                            onPress={() => {
                                setMenuVisible(false)
                                navigation.navigate("search", {
                                    screen: "EditOwnerProfileScreen",
                                })
                            }}
                        />
                        <MenuItem label="Settings" onPress={() => navigation.navigate("Settings")} />
                        <MenuItem label="Help & Support" onPress={() => navigation.navigate("HelpSupport")} />
                        <MenuItem label="About" onPress={() => navigation.navigate("About")} />
                        <MenuItem
                            label="Logout"
                            danger
                            onPress={logout}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    )
}

const MenuItem = ({
    label,
    onPress,
    danger,
}: any) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={onPress}
    >
        <Text
            style={[
                styles.menuText,
                danger && { color: "red" },
            ]}
        >
            {label}
        </Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    greeting: { fontSize: 14, color: "#666" },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    subtitle: { fontSize: 12, color: "#999" },
    avatar: { width: 42, height: 42, borderRadius: 21 },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        alignItems: "flex-end",
        paddingTop: 70,
        paddingRight: 16,
    },
    menu: {
        backgroundColor: "#fff",
        width: 200,
        borderRadius: 12,
    },
    menuItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuText: { fontSize: 14 },
})

export default DashboardHeader
