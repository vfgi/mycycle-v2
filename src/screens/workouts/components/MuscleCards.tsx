import React from "react";
import { VStack, HStack, Text, Box, Pressable } from "@gluestack-ui/themed";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface MuscleCardsProps {
  onWorkoutsPress?: () => void;
  onPlansPress?: () => void;
}

export const MuscleCards: React.FC<MuscleCardsProps> = ({
  onWorkoutsPress,
  onPlansPress,
}) => {
  const { t } = useTranslation();

  return (
    <HStack space="md" px="$4" mb="$4">
      {/* Card de Treinos */}
      <Pressable flex={1} onPress={onWorkoutsPress}>
        <Box borderRadius="$xl" overflow="hidden" height={120}>
          <ImageBackground
            source={require("../../../../assets/images/exercises/chest.jpg")}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["#FF6B35AA", "#F7931EAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                padding: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                space="xs"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                  textAlign="center"
                >
                  {t("navigation.workouts")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[200]}
                  fontSize="$sm"
                  textAlign="center"
                >
                  {t("workouts.viewWorkouts")}
                </Text>
              </VStack>
            </LinearGradient>
          </ImageBackground>
        </Box>
      </Pressable>

      {/* Card de Planos */}
      <Pressable flex={1} onPress={onPlansPress}>
        <Box borderRadius="$xl" overflow="hidden" height={120}>
          <ImageBackground
            source={require("../../../../assets/images/exercises/back.jpg")}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["#4ECDC4AA", "#44A08DAA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                padding: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <VStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                space="xs"
              >
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$xl"
                  fontWeight="$bold"
                  textAlign="center"
                >
                  {t("workouts.trainingPlans")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[200]}
                  fontSize="$sm"
                  textAlign="center"
                >
                  {t("workouts.viewPlans")}
                </Text>
              </VStack>
            </LinearGradient>
          </ImageBackground>
        </Box>
      </Pressable>
    </HStack>
  );
};
