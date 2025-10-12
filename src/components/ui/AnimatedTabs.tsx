import React, { useState, useRef, ReactNode } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  ReduceMotion,
} from "react-native-reanimated";
import Typography from "./Typography";
import { FIXED_COLORS } from "../../theme/colors";

export type TabItem = {
  id: string;
  title: string;
  icon?: React.ReactElement;
  content: React.ReactNode;
};

export type AnimatedTabsProps = {
  tabs: TabItem[];
  containerStyle?: StyleProp<ViewStyle>;
  headerContainerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  tabTextStyle?: StyleProp<TextStyle>;
  activeTabTextStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  reduceMotion?: "always" | "never" | "system";
};

const INDICATOR_ANIM_DURATION = 250;
const INDICATOR_HEIGHT = 3;

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  containerStyle,
  headerContainerStyle,
  tabStyle,
  tabTextStyle,
  activeTabTextStyle,
  indicatorStyle,
  reduceMotion = "system",
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const layoutRef = useRef<Array<{ x: number; width: number }>>([]);

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const motion =
    reduceMotion === "never"
      ? ReduceMotion.Never
      : reduceMotion === "always"
      ? ReduceMotion.Always
      : ReduceMotion.System;

  const handleTabPress = (index: number) => {
    if (layoutRef.current[index]) {
      const { x, width } = layoutRef.current[index];
      indicatorX.value = withTiming(x, {
        duration: INDICATOR_ANIM_DURATION,
        easing: Easing.out(Easing.quad),
        reduceMotion: motion,
      });
      indicatorWidth.value = withTiming(width, {
        duration: INDICATOR_ANIM_DURATION,
        easing: Easing.out(Easing.quad),
        reduceMotion: motion,
      });
      setSelectedTabIndex(index);
    }
  };

  const handleTabLayout = (event: LayoutChangeEvent, index: number) => {
    const { x, width } = event.nativeEvent.layout;
    layoutRef.current[index] = { x, width };

    if (index === selectedTabIndex && indicatorWidth.value === 0) {
      indicatorX.value = x;
      indicatorWidth.value = width;
    }
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorX.value }],
    };
  });

  const CurrentContent = tabs[selectedTabIndex]?.content ?? null;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.headerContainer,
          headerContainerStyle,
          { borderBottomColor: FIXED_COLORS.background[700] },
        ]}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, tabStyle]}
            onPress={() => handleTabPress(index)}
            onLayout={(event) => handleTabLayout(event, index)}
            activeOpacity={0.8}
          >
            {tab.icon && <View style={styles.iconContainer}>{tab.icon}</View>}
            <Typography
              size="sm"
              weight="regular"
              color={
                selectedTabIndex === index
                  ? FIXED_COLORS.text[50]
                  : FIXED_COLORS.text[400]
              }
              numberOfLines={1}
              style={[
                tabTextStyle,
                selectedTabIndex === index && activeTabTextStyle,
              ]}
            >
              {tab.title}
            </Typography>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            indicatorAnimatedStyle,
            { backgroundColor: FIXED_COLORS.primary[600] },
          ]}
        />
        <View
          style={[
            styles.headerBorder,
            { borderBottomColor: FIXED_COLORS.background[700] },
          ]}
        />
      </View>

      <View style={styles.contentContainer}>{CurrentContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    position: "relative",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
  },
  iconContainer: {
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    padding: 0,
  },
});

export default AnimatedTabs;
