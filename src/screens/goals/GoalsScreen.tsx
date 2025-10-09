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
import { userService } from "../../services/userService";
import { Goals, ObjectiveType } from "../../types/goals";
import { GoalCard } from "./GoalCard";
import { GoalCardCompact } from "./GoalCardCompact";
import { SectionTitle } from "./SectionTitle";
import { ObjectiveSelector } from "./ObjectiveSelector";

export const GoalsScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    convertWeight,
    convertMacronutrient,
    getMacroUnit,
    convertWater,
    getWaterUnit,
    unitSystem,
  } = useUnits();
  const { showSuccess, showError } = useToast();
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

        // Peso - converter para unidade atual
        if (goals.targetWeight) {
          const converted = convertWeight(goals.targetWeight);
          setTargetWeight(converted.value.toString());
        }

        // Gordura corporal - sempre em %
        setTargetBodyFat(goals.targetBodyFat?.toString() || "");

        // Calorias - sempre em kcal
        setTargetCalories(goals.targetCalories?.toString() || "");

        // Macronutrientes - converter para unidade atual
        if (goals.targetProtein) {
          const converted = convertMacronutrient(goals.targetProtein);
          setTargetProtein(converted.value.toString());
        }
        if (goals.targetCarbs) {
          const converted = convertMacronutrient(goals.targetCarbs);
          setTargetCarbs(converted.value.toString());
        }
        if (goals.targetFat) {
          const converted = convertMacronutrient(goals.targetFat);
          setTargetFat(converted.value.toString());
        }

        // Exercícios - sempre em números
        setWeeklyWorkouts(goals.weeklyWorkouts?.toString() || "");
        setDailyExercises(goals.dailyExercises?.toString() || "");

        // Água - converter para unidade atual (L ou gal)
        if (goals.waterIntake) {
          const converted = convertWater(goals.waterIntake);
          setWaterIntake(converted.value.toString());
        }
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  // Função para converter objective para o formato da API
  const convertObjectiveForAPI = (
    objective?: ObjectiveType
  ): string | undefined => {
    if (!objective) return undefined;

    const objectiveMap: Record<ObjectiveType, string> = {
      weightLoss: "weight_loss",
      hypertrophy: "hypertrophy",
      definition: "definition",
    };

    return objectiveMap[objective];
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Converter peso para kg (sempre salvar em kg)
      let weightInKg = targetWeight ? parseFloat(targetWeight) : undefined;
      if (weightInKg && unitSystem === "imperial") {
        weightInKg = weightInKg / 2.205; // lbs to kg
      }

      // Converter macronutrientes para gramas (sempre salvar em g)
      let proteinInG = targetProtein ? parseFloat(targetProtein) : undefined;
      let carbsInG = targetCarbs ? parseFloat(targetCarbs) : undefined;
      let fatInG = targetFat ? parseFloat(targetFat) : undefined;

      if (unitSystem === "imperial") {
        if (proteinInG) proteinInG = proteinInG / 0.035274; // oz to g
        if (carbsInG) carbsInG = carbsInG / 0.035274; // oz to g
        if (fatInG) fatInG = fatInG / 0.035274; // oz to g
      }

      // Converter água para litros (sempre salvar em L)
      let waterInL = waterIntake ? parseFloat(waterIntake) : undefined;
      if (waterInL && unitSystem === "imperial") {
        waterInL = waterInL / 0.264172; // gal to L
      }

      const goals: Goals = {
        objective,
        targetWeight: weightInKg,
        targetBodyFat: targetBodyFat ? parseFloat(targetBodyFat) : undefined,
        targetCalories: targetCalories ? parseFloat(targetCalories) : undefined,
        targetProtein: proteinInG,
        targetCarbs: carbsInG,
        targetFat: fatInG,
        weeklyWorkouts: weeklyWorkouts ? parseInt(weeklyWorkouts) : undefined,
        dailyExercises: dailyExercises ? parseInt(dailyExercises) : undefined,
        waterIntake: waterInL,
      };

      // Criar versão dos goals com objective convertido para API
      const goalsForAPI: any = {
        ...goals,
        objective: convertObjectiveForAPI(goals.objective),
      };

      // Primeiro tenta salvar na API
      await userService.updateProfile({ goals: goalsForAPI });

      // Se API teve sucesso, então salva localmente
      await goalsService.saveGoals(goals);

      showSuccess(t("goals.goalsSaved"));
    } catch (error) {
      console.error("Error saving goals:", error);
      showError(t("goals.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const weightUnit = convertWeight(0).unit;
  const macroUnit = getMacroUnit();
  const waterUnit = getWaterUnit();

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
                    label={`${t("goals.waterIntake")} (${waterUnit})`}
                    value={waterIntake}
                    onChangeText={setWaterIntake}
                    placeholder="3"
                    icon={require("../../../assets/images/Water-Drinking.jpg")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={`${t("goals.targetProtein")} (${macroUnit})`}
                    value={targetProtein}
                    onChangeText={setTargetProtein}
                    placeholder="120"
                    icon={require("../../../assets/images/protein-types.jpeg")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={`${t("goals.targetCarbs")} (${macroUnit})`}
                    value={targetCarbs}
                    onChangeText={setTargetCarbs}
                    placeholder="250"
                    icon={require("../../../assets/images/carbs.webp")}
                  />
                </VStack>

                <VStack flex={1} minWidth="48%">
                  <GoalCardCompact
                    label={`${t("goals.targetFat")} (${macroUnit})`}
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
