import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
} from "react-native";
import {
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  ReduceMotion,
  Easing,
  interpolateColor,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width: screenWidth } = Dimensions.get("window");
const SLIDER_TRACK_WIDTH = screenWidth * 0.8;
const SLIDER_SIZE = 50;
const TRACK_HEIGHT = SLIDER_SIZE + 10;
const BORDER_RADIUS = 16;
const TRACK_PADDING = 5;
const SLIDER_INITIAL_LEFT = 5;
const COMPLETION_THRESHOLD_PERCENTAGE = 0.98;

type SwipeSliderProps = {
  onSwipeComplete: () => void;
  enableHaptics?: boolean;
  sliderSize?: number;
  sliderTrackWidth?: number;
  sliderTrackHeight?: number;
  borderRadius?: number;
  initialTrackColor: string;
  completeTrackColor: string;
  sliderBackgroundColor: string;
  textColor: string;
  initialText: string;
  completeText: string;
  startIcon: React.ReactElement;
  endIcon: React.ReactElement;
  trackStyle?: StyleProp<ViewStyle>;
  handleStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  reduceMotion?: "never" | "always" | "system";
};

const SwipeSlider: React.FC<SwipeSliderProps> = ({
  onSwipeComplete,
  enableHaptics = true,
  sliderSize = SLIDER_SIZE,
  sliderTrackWidth = SLIDER_TRACK_WIDTH,
  sliderTrackHeight = TRACK_HEIGHT,
  borderRadius = BORDER_RADIUS,
  initialTrackColor,
  completeTrackColor,
  sliderBackgroundColor,
  textColor,
  initialText,
  completeText,
  startIcon,
  endIcon,
  textStyle,
  reduceMotion = "system",
}) => {
  const offset = useSharedValue(0);
  const completionProgress = useSharedValue(0);
  const MaxOffset =
    sliderTrackWidth - sliderSize - TRACK_PADDING - SLIDER_INITIAL_LEFT;
  const CompletionOffset = MaxOffset * COMPLETION_THRESHOLD_PERCENTAGE;

  const motion =
    reduceMotion === "never"
      ? ReduceMotion.Never
      : reduceMotion === "always"
        ? ReduceMotion.Always
        : ReduceMotion.System;

  const TIMING_CONFIG = {
    duration: 350,
    easing: Easing.in(Easing.linear),
    reduceMotion: motion,
  };

  const handleHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      const newOffset = offset.value + event.changeX;
      offset.value = Math.max(0, Math.min(newOffset, MaxOffset));
    })
    .onEnd(() => {
      if (offset.value >= CompletionOffset) {
        completionProgress.value = withTiming(1, TIMING_CONFIG);
        runOnJS(onSwipeComplete)();
        enableHaptics && runOnJS(handleHaptic)();
        // Voltar ao início após completar
        setTimeout(() => {
          offset.value = withTiming(0, TIMING_CONFIG);
          completionProgress.value = withTiming(0, TIMING_CONFIG);
        }, 300);
      } else {
        completionProgress.value = withTiming(0, TIMING_CONFIG);
        offset.value = withTiming(0, TIMING_CONFIG);
      }
    });

  const sliderHandleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const sliderTrackAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        offset.value,
        [0, MaxOffset],
        [initialTrackColor, completeTrackColor]
      ),
    };
  });

  const startIconOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        offset.value,
        [0, MaxOffset * 0.3],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const endIconOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        offset.value,
        [MaxOffset * 0.7, MaxOffset],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  const initialTextOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        completionProgress.value,
        [0, 0.5],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  const completeTextOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        completionProgress.value,
        [0.5, 1],
        [0, 1],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <View
      style={[
        styles.sliderTrack,
        {
          width: sliderTrackWidth,
          height: sliderTrackHeight,
          borderRadius: borderRadius,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.sliderTrackInner,
          {
            borderRadius: borderRadius,
          },
          sliderTrackAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[styles.startIconContainer, startIconOpacity]}
        >
          {startIcon}
        </Animated.View>

        <Animated.View style={[styles.textContainer, initialTextOpacity]}>
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {initialText}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            styles.completeTextContainer,
            completeTextOpacity,
          ]}
        >
          <Text style={[styles.text, { color: textColor }, textStyle]}>
            {completeText}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.endIconContainer, endIconOpacity]}>
          {endIcon}
        </Animated.View>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sliderHandle,
            {
              width: sliderSize,
              height: sliderSize,
              backgroundColor: sliderBackgroundColor,
              borderRadius: borderRadius,
              left: SLIDER_INITIAL_LEFT,
            },
            sliderHandleStyle,
          ]}
        >
          {startIcon}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderTrack: {
    position: "relative",
    overflow: "hidden",
  },
  sliderTrackInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderHandle: {
    position: "absolute",
    top: TRACK_PADDING,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startIconContainer: {
    position: "absolute",
    left: 70,
  },
  endIconContainer: {
    position: "absolute",
    right: 70,
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  completeTextContainer: {
    position: "absolute",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SwipeSlider;

