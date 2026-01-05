import { Video } from "expo-av"
import React, { useRef, useState } from "react"
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    View,
} from "react-native"

const IMAGE_HEIGHT = 180
const CARD_HORIZONTAL_PADDING = 48
const { width } = Dimensions.get("window")
const SLIDE_WIDTH = width - CARD_HORIZONTAL_PADDING

type Props = {
    images: string[]
    videoUrl?: string
}

export const ImageSlider = ({ images, videoUrl }: Props) => {
    // console.log("IMAGE SLIDER VIDEO 👉", videoUrl)
    const [activeIndex, setActiveIndex] = useState(0)
    const videoRef = useRef<Video>(null)
    // console.log(videoUrl)

    const slides = [
        ...images.map(uri => ({ type: "image", uri })),
        ...(videoUrl ? [{ type: "video", uri: videoUrl }] : []),
    ]


    const handleScrollEnd = (e: any) => {
        const index = Math.round(
            e.nativeEvent.contentOffset.x / SLIDE_WIDTH
        )
        setActiveIndex(index)

        if (slides[index]?.type === "video") {
            videoRef.current?.playAsync()
        } else {
            videoRef.current?.pauseAsync()
        }
    }

    return (
        <View style={{ height: IMAGE_HEIGHT }}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
            >
                {slides.map((item, index) => {
                    if (item.type === "video") {
                        return (
                            <Video
                                key={index}
                                ref={videoRef}
                                source={{ uri: item.uri }}
                                style={[styles.image, { width: SLIDE_WIDTH }]}
                                resizeMode="cover"
                                useNativeControls
                                isLooping
                            />
                        )
                    }

                    return (
                        <Image
                            key={index}
                            source={{ uri: item.uri }}
                            style={[styles.image, { width: SLIDE_WIDTH }]}
                        />
                    )
                })}
            </ScrollView>

            {/* DOTS */}
            <View style={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            activeIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: IMAGE_HEIGHT,
        resizeMode: "cover",
    },
    dotsContainer: {
        position: "absolute",
        bottom: 8,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: "#007AFF",
        width: 8,
        height: 8,
    },
})
