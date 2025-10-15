import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  ReduceMotion,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export type ProgressBarProps = {
  progress: number; // Value between 0 and 1
  height: number;
  width: number;
  text?: string;
  icon?: React.ReactElement;
  iconGap?: number; //if gap is not added icon container is as big as the height of the bar
  iconContainerColor?: string;
  animationDuration?: number;
  reduceMotion?: "never" | "always" | "system";
  containerStyle?: StyleProp<ViewStyle>;
  trackColor?: string;
  textStyle?: StyleProp<TextStyle>;
  colorAtZeroProgress?: string;
  colorAtMidProgress?: string;
  colorAtFullProgress?: string;
};

const DEFAULT_HEIGHT = 30;
const DEFAULT_WIDTH = Dimensions.get("window").width * 0.8;

export default function AnimatedProgressBar({
  progress,
  text,
  icon,
  iconGap = 4,
  iconContainerColor = "#FFFFFF33",
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
  animationDuration = 700,
  reduceMotion = "system",
  containerStyle,
  trackColor = "#E0E0E0",
  textStyle,
  colorAtZeroProgress = "#FF6B6B",
  colorAtMidProgress = "#FFA500",
  colorAtFullProgress = "#4CAF50",
}: ProgressBarProps) {
  const progressValue = useSharedValue(0);
  const barBorderRadius = height ?? DEFAULT_HEIGHT / 2;
  const iconContainerSize = height - iconGap;

  const motion =
    reduceMotion === "never"
      ? ReduceMotion.Never
      : reduceMotion === "always"
      ? ReduceMotion.Always
      : ReduceMotion.System;

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    progressValue.value = withTiming(clampedProgress, {
      duration: animationDuration,
      easing: Easing.out(Easing.quad),
      reduceMotion: motion,
    });
  }, [progress]);

  const animatedProgressFillStyle = useAnimatedStyle(() => {
    return {
      width: progressValue.value * width,
    };
  });

  const sliderHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progressValue.value * width - iconContainerSize - iconGap,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: width,
          height: height,
          borderRadius: barBorderRadius,
          backgroundColor: trackColor,
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={[styles.progressFillContainer, animatedProgressFillStyle]}
      >
        <LinearGradient
          colors={[
            colorAtZeroProgress,
            colorAtMidProgress,
            colorAtFullProgress,
          ]}
          style={[styles.gradientFill, { borderRadius: barBorderRadius }]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>

      {text && (
        <View style={styles.textContainer}>
          <Text style={[styles.text, textStyle]}>{text}</Text>
        </View>
      )}
      {icon && (
        <Animated.View
          style={[
            styles.iconOuterContainer,
            {
              height: iconContainerSize,
              width: iconContainerSize,
              borderRadius: iconContainerSize / 2,
              backgroundColor: iconContainerColor,
            },
            sliderHandleStyle,
          ]}
        >
          <View style={[styles.iconInnerContainer]}>{icon}</View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFillContainer: {
    // New container for the gradient, its width is animated
    height: "100%",
    position: "absolute",
    left: 0,
  },
  gradientFill: {
    // The LinearGradient fills its animated container
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  iconOuterContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  iconInnerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
