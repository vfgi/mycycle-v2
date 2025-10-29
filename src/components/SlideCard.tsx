import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { FIXED_COLORS } from "../theme/colors";

const { width: screenWidth } = Dimensions.get("window");

export interface SlideCardImage {
  uri?: string;
  source?: any;
}

export interface SlideCardProps {
  images: SlideCardImage[];
  title: string;
  bottomText?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const SlideCard: React.FC<SlideCardProps> = ({
  images,
  title,
  bottomText,
  buttonText,
  onButtonPress,
  height = 300,
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const renderItem = ({ item }: { item: SlideCardImage }) => {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={item.uri ? { uri: item.uri } : item.source}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: FIXED_COLORS.background[800],
      }}
    >
      <Carousel
        loop
        width={screenWidth - 32}
        height={height}
        autoPlay={autoPlay}
        data={images}
        scrollAnimationDuration={1000}
        autoPlayInterval={autoPlayInterval}
        renderItem={renderItem}
        panGestureHandlerEnabled={false}
        enabled={false}
      />

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: FIXED_COLORS.background[0],
          }}
        >
          {title}
        </Text>
      </View>

      {(bottomText || buttonText) && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {bottomText && (
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                color: FIXED_COLORS.background[0],
                marginRight: buttonText ? 12 : 0,
              }}
            >
              {bottomText}
            </Text>
          )}

          {buttonText && onButtonPress && (
            <TouchableOpacity
              onPress={onButtonPress}
              style={{
                backgroundColor: FIXED_COLORS.primary[600],
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: FIXED_COLORS.background[950],
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                {buttonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};
