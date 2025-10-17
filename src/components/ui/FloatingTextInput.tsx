import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Text,
  TextInputProps,
  PixelRatio,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  interpolateColor,
  withTiming,
  Easing,
  ReduceMotion,
} from "react-native-reanimated";
import { useRef, useState, useMemo, useEffect } from "react";

// These should ideally match your StyleSheet to avoid magic numbers
const DEFAULT_INPUT_HEIGHT = 50; //you can change this according to your liking
const DEFAULT_LABEL_FONT_SIZE = 14; //This too
const CONTAINER_PADDING_TOP = 6; // Matches styles.container.paddingTop

type FloatingTextInputProps = {
  containerStyle?: StyleProp<ViewStyle>;
  startIcon?: React.ReactElement;
  backgroundColor: string;
  label: string;
  valueColor: string;
  isFocusLabelColor: string; //placeholder color after focus
  isBlurLabelColor: string; //placeholder color before foucs/touching
  isFocusBorderColor: string; //border color after focusing
  isBlurBorderColor: string; //border color before focus/touch
  isBlurValueBorderColor: string; //border color after editing value
  isError?: boolean;
  errorMessage?: string;
  reduceMotion?: "never" | "always" | "system";
  height?: number;
};

export default function FloatingTextInput(
  props: React.JSX.IntrinsicAttributes &
    React.JSX.IntrinsicClassAttributes<TextInput> &
    Readonly<TextInputProps> &
    FloatingTextInputProps
) {
  const fontScale = PixelRatio.getFontScale();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const animatedValue = useSharedValue(0);
  const motion =
    props?.reduceMotion === "never"
      ? ReduceMotion.Never
      : props?.reduceMotion === "always"
      ? ReduceMotion.Always
      : ReduceMotion.System;

  // Dynamic Calculation Logic
  const { inputHeight, labelFontSize } = useMemo(() => {
    // Flatten style prop to handle potential arrays
    const flatStyle = StyleSheet.flatten(props.style);
    // Get height from props.style or use default
    const height =
      typeof flatStyle?.height === "number"
        ? flatStyle.height
        : DEFAULT_INPUT_HEIGHT * fontScale;

    // Get label font size from props (if you were to make it configurable) or use default
    // For now, using the default defined above. You could also extract from styles.label if needed.
    const fontSize = DEFAULT_LABEL_FONT_SIZE * fontScale;
    return { inputHeight: height, labelFontSize: fontSize };
  }, [props.style]); // Recalculate only if props.style changes

  // Calculate dynamic positions based on height/fontSize
  const initialLabelTop = useMemo(
    () => CONTAINER_PADDING_TOP + inputHeight / 2.2 - labelFontSize / 2,
    [inputHeight, labelFontSize]
  );
  const translateYUp = useMemo(() => -inputHeight / 2, [inputHeight]);
  //End

  // Inicializar a animação se o campo já tiver valor
  useEffect(() => {
    if (props.value) {
      animatedValue.value = 1;
    }
  }, []);

  // Atualizar animação quando o valor mudar externamente
  useEffect(() => {
    if (props.value && animatedValue.value === 0) {
      animatedValue.value = withTiming(1, {
        duration: 200,
        easing: Easing.in(Easing.linear),
        reduceMotion: motion,
      });
    } else if (!props.value && !isFocused && animatedValue.value === 1) {
      animatedValue.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.linear),
        reduceMotion: motion,
      });
    }
  }, [props.value]);

  const handleFocus = () => {
    setIsFocused(true);
    animatedValue.value = withTiming(1, {
      duration: 200,
      easing: Easing.in(Easing.linear),
      reduceMotion: motion,
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!props.value) {
      animatedValue.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.linear),
        reduceMotion: motion,
      });
    }
  };

  const getBorderColor = () => {
    if (props.isError) {
      return "#F65936";
    }
    if (isFocused) {
      return props.isFocusBorderColor;
    }
    if (props.value) {
      return props.isBlurValueBorderColor;
    }
    return props.isBlurBorderColor;
  };

  const labelStyle = useAnimatedStyle(() => {
    return {
      // Set the calculated initial top position
      top: initialLabelTop,
      transform: [
        {
          // Use the calculated upward translation distance
          translateY: interpolate(
            animatedValue.value,
            [0, 1],
            [0, translateYUp] // Use calculated value
          ),
        },
        {
          scale: interpolate(animatedValue.value, [0, 1], [1, 0.85]),
        },
      ],
      color: interpolateColor(
        animatedValue.value,
        [0, 1],
        [props.isBlurLabelColor, props.isFocusLabelColor]
      ),
    };
  });

  return (
    <View style={[styles.outerContainer]}>
      <View
        onTouchStart={() => inputRef?.current?.focus()}
        style={[styles.container, props?.containerStyle]}
      >
        <Animated.Text
          style={[
            styles.label,
            labelStyle,
            { backgroundColor: props.backgroundColor },
          ]}
        >
          {props?.label}
        </Animated.Text>
        <TextInput
          accessibilityLabel={props.label}
          ref={inputRef}
          clearButtonMode="always"
          keyboardAppearance="dark"
          style={[
            styles.input,
            {
              height: inputHeight,
              color: props.valueColor,
              backgroundColor: props?.backgroundColor ?? "transparent",
              borderColor: getBorderColor(),
            },
            props?.style,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      {props?.isError && (
        <Text style={[styles.errorText, { color: "#F65936" }]}>
          {props?.errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 0,
  },
  container: {
    paddingTop: CONTAINER_PADDING_TOP, // Use constant
    position: "relative",
  },
  input: {
    width: "100%",
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  label: {
    position: "absolute",
    fontSize: DEFAULT_LABEL_FONT_SIZE,
    marginLeft: 16,
    zIndex: 10,
    paddingHorizontal: 4,
    elevation: 10,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
