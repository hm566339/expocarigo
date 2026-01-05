import { View, Text, Image, Pressable, Button } from "react-native"

type Props = {
    title: string
    imageUri?: string
    status: "pending" | "uploaded" | "error"
    onUpload: () => void
    onImagePress?: () => void
}

export const ImageUploader = ({
    title,
    imageUri,
    status,
    onUpload,
    onImagePress,
}: Props) => {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text>{title}</Text>

            {/* IMAGE / NO IMAGE BOX */}
            <Pressable onPress={onImagePress}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={{ height: 150, borderRadius: 8 }}
                    />
                ) : (
                    <View
                        style={{
                            height: 150,
                            borderWidth: 1,
                            borderStyle: "dashed",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text>No Image</Text>
                    </View>
                )}
            </Pressable>

            {/* UPLOAD BUTTON */}
            <Button title="Upload" onPress={onUpload} />

            <Text>Status: {status}</Text>
        </View>
    )
}
