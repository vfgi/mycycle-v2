import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
  ReduceMotion,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const DEFAULT_SIZE = 100;
const DEFAULT_STROKE_WIDTH = 8;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressCircleProps = {
  progress: number;
  progressColor: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
  animationDuration?: number;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  reduceMotion?: "never" | "always" | "system";
};

export default function ProgressCircle({
  progress,
  progressColor,
  trackColor,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  animationDuration = 1000,
  children,
  containerStyle,
  reduceMotion = "system",
}: ProgressCircleProps) {
  const actualRadius = (size - strokeWidth) / 2;
  const actualCircumference = 2 * Math.PI * actualRadius;

  const progressValue = useSharedValue(0);
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
  }, [progress, animationDuration, progressValue]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: actualCircumference * (1 - progressValue.value),
  }));

  return (
    <View
      style={[styles.container, { width: size, height: size }, containerStyle]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={actualRadius}
          stroke={trackColor}
          fill="none"
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={actualRadius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={actualCircumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children && (
        <View style={[styles.childrenContainer, { width: size, height: size }]}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  childrenContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});

