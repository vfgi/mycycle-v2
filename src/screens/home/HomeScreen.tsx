import React from "react";
import { ScrollView } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SafeContainer,
  StatsCard,
  AdBanner,
  SlideCard,
} from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { getHomeSlides } from "./homeData";
import { BottomTabParamList } from "../../navigation/BottomTabNavigator";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList>,
  StackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const slides = getHomeSlides();

  const handleSlidePress = (slideId: string) => {
    switch (slideId) {
      case "workouts":
        navigation.navigate("Workouts");
        break;
      case "nutrition":
        navigation.navigate("Nutrition");
        break;
      case "progress":
        navigation.navigate("History");
        break;
      default:
        break;
    }
  };

  return (
    <SafeContainer paddingHorizontal={12} paddingTop={0} paddingBottom={0}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <VStack flex={1} space="lg">
          <StatsCard />
          <AdBanner
            size="BANNER"
            maxHeight={80}
            isPremium={user?.is_premium || false}
          />

          {slides.map((slide) => (
            <SlideCard
              key={slide.id}
              images={slide.images}
              title={t(slide.titleKey)}
              bottomText={t(slide.descriptionKey)}
              buttonText={
                slide.buttonTextKey ? t(slide.buttonTextKey) : undefined
              }
              onButtonPress={
                slide.buttonTextKey
                  ? () => handleSlidePress(slide.id)
                  : undefined
              }
              height={slide.height}
              autoPlayInterval={slide.autoPlayInterval}
            />
          ))}
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
