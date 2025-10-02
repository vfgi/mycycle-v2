import React, { useState, useEffect } from "react";
import {
  ScrollView,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { VStack, HStack, Text } from "@gluestack-ui/themed";
import { SafeContainer, CustomButton } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useUnits } from "../../contexts/UnitsContext";
import { useToast } from "../../hooks/useToast";
import { goalsService } from "../../services/goalsService";
import { Goals, ObjectiveType } from "../../types/goals";
import { GoalCard } from "./GoalCard";
import { GoalCardCompact } from "./GoalCardCompact";
import { SectionTitle } from "./SectionTitle";
import { ObjectiveSelector } from "./ObjectiveSelector";

export const GoalsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { convertWeight } = useUnits();
  const { showSuccess } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [objective, setObjective] = useState<ObjectiveType | undefined>(
    undefined
  );
  const [targetWeight, setTargetWeight] = useState("");
  const [targetBodyFat, setTargetBodyFat] = useState("");
  const [targetCalories, setTargetCalories] = useState("");
  const [targetProtein, setTargetProtein] = useState("");
  const [targetCarbs, setTargetCarbs] = useState("");
  const [targetFat, setTargetFat] = useState("");
  const [weeklyWorkouts, setWeeklyWorkouts] = useState("");
  const [dailyExercises, setDailyExercises] = useState("");
  const [waterIntake, setWaterIntake] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const goals = await goalsService.getGoals();
      if (goals) {
        setObjective(goals.objective);
        if (goals.targetWeight) {
          const converted = convertWeight(goals.targetWeight);
          setTargetWeight(converted.value.toString());
        }
        setTargetBodyFat(goals.targetBodyFat?.toString() || "");
        setTargetCalories(goals.targetCalories?.toString() || "");
        setTargetProtein(goals.targetProtein?.toString() || "");
        setTargetCarbs(goals.targetCarbs?.toString() || "");
        setTargetFat(goals.targetFat?.toString() || "");
        setWeeklyWorkouts(goals.weeklyWorkouts?.toString() || "");
        setDailyExercises(goals.dailyExercises?.toString() || "");
        setWaterIntake(goals.waterIntake?.toString() || "");
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let weightInKg = targetWeight ? parseFloat(targetWeight) : undefined;
      if (weightInKg && weightUnit === "lbs") {
        weightInKg = weightInKg / 2.205;
      }

      const goals: Goals = {
        objective,
        targetWeight: weightInKg,
        targetBodyFat: targetBodyFat ? parseFloat(targetBodyFat) : undefined,
        targetCalories: targetCalories ? parseFloat(targetCalories) : undefined,
        targetProtein: targetProtein ? parseFloat(targetProtein) : undefined,
        targetCarbs: targetCarbs ? parseFloat(targetCarbs) : undefined,
        targetFat: targetFat ? parseFloat(targetFat) : undefined,
        weeklyWorkouts: weeklyWorkouts ? parseInt(weeklyWorkouts) : undefined,
        dailyExercises: dailyExercises ? parseInt(dailyExercises) : undefined,
        waterIntake: waterIntake ? parseFloat(waterIntake) : undefined,
      };

      await goalsService.saveGoals(goals);
      showSuccess(t("goals.goalsSaved"));
    } catch (error) {
      console.error("Error saving goals:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const weightUnit = convertWeight(0).unit;

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <VStack flex={1}>
          <ImageBackground
            source={{
              uri: "https://imageio.forbes.com/specials-images/imageserve/5fd2263efcf061ccad6f7d95/Goals-setting-strategy-for-business-management-/960x0.jpg?format=jpg&width=960",
            }}
            style={styles.headerImage}
            imageStyle={styles.imageStyle}
          >
            <VStack
              style={styles.overlay}
              alignItems="center"
              justifyContent="center"
            >
              <Text
                color={FIXED_COLORS.background[0]}
                fontSize="$3xl"
                fontWeight="$bold"
                textAlign="center"
              >
                {t("goals.defineYourGoals")}
              </Text>
            </VStack>
          </ImageBackground>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
          >
            <VStack px="$6" pt="$6" space="md">
              <SectionTitle title={t("goals.health")} />

              <ObjectiveSelector selected={objective} onSelect={setObjective} />

              <GoalCard
                label={`${t("goals.targetWeight")} (${weightUnit})`}
                value={targetWeight}
                onChangeText={setTargetWeight}
                placeholder="70"
                icon={require("../../../assets/commom-icons/se-pesando.webp")}
              />

              <SectionTitle title={t("goals.nutrition")} />

              <HStack space="md" flexWrap="wrap" justifyContent="space-between">
                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.targetCalories")}
                    value={targetCalories}
                    onChangeText={setTargetCalories}
                    placeholder="2200"
                    icon={require("../../../assets/images/calculatorcalories.avif")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.waterIntake")}
                    value={waterIntake}
                    onChangeText={setWaterIntake}
                    placeholder="3"
                    icon={require("../../../assets/images/Water-Drinking.jpg")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.targetProtein")}
                    value={targetProtein}
                    onChangeText={setTargetProtein}
                    placeholder="120"
                    icon={require("../../../assets/images/protein-types.jpeg")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.targetCarbs")}
                    value={targetCarbs}
                    onChangeText={setTargetCarbs}
                    placeholder="250"
                    icon={require("../../../assets/images/carbs.webp")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.targetFat")}
                    value={targetFat}
                    onChangeText={setTargetFat}
                    placeholder="60"
                    icon={require("../../../assets/images/Healthy-Fats.jpg")}
                  />
                </VStack>
              </HStack>

              <SectionTitle title={t("goals.exercises")} />

              <HStack space="md" flexWrap="wrap" justifyContent="space-between">
                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.dailyExercises")}
                    value={dailyExercises}
                    onChangeText={setDailyExercises}
                    placeholder="5"
                    icon={require("../../../assets/commom-icons/holding-dumbells.png")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={t("goals.weeklyWorkouts")}
                    value={weeklyWorkouts}
                    onChangeText={setWeeklyWorkouts}
                    placeholder="5"
                    icon={require("../../../assets/commom-icons/punch-bag.png")}
                  />
                </VStack>
              </HStack>
            </VStack>
          </ScrollView>

          <VStack
            bg={FIXED_COLORS.background[800]}
            p="$4"
            mb="$6"
            borderTopWidth={1}
            borderTopColor={FIXED_COLORS.background[700]}
          >
            <CustomButton
              text={t("goals.saveGoals")}
              onPress={handleSave}
              isLoading={isSaving}
              mt="$0"
            />
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    height: 200,
    width: "100%",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
