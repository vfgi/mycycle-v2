import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Modal,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import {
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Box,
  Pressable,
} from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { useMeasurementsEditor } from "../../measurements/hooks/useMeasurementsEditor";
import { MeasurementsEditorContent } from "../../measurements/components/MeasurementsEditorContent";
import { ObjectiveSelector } from "../../goals/ObjectiveSelector";
import { convertObjectiveForAPI } from "../../goals/convertObjectiveForApi";
import { goalsService } from "../../../services/goalsService";
import { userService } from "../../../services/userService";
import { Goals, ObjectiveType } from "../../../types/goals";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../contexts/AuthContext";
import { assistantSetupStorage } from "../../../services/assistantSetupStorage";

interface AssistantSetupModalProps {
  visible: boolean;
  onCancel: () => void;
}

type AssistantStep = 0 | 1 | 2 | 3 | 4 | 5;

function toPersistedAssistantStep(s: AssistantStep): number {
  return s === 4 ? 3 : s;
}

export const AssistantSetupModal: React.FC<AssistantSetupModalProps> = ({
  visible,
  onCancel,
}) => {
  const { t, getCurrentLanguage } = useTranslation();
  const insets = useSafeAreaInsets();
  const { showError } = useToast();
  const { updateUser, user: authUser } = useAuth();
  const { convertHeight, convertBodyMeasurement, convertWeight, unitSystem } =
    useUnits();
  const [step, setStep] = useState<AssistantStep>(0);
  const [selectedObjective, setSelectedObjective] = useState<
    ObjectiveType | undefined
  >(undefined);
  const [isSavingObjective, setIsSavingObjective] = useState(false);
  const [planGenIconSport, setPlanGenIconSport] = useState(true);
  const [currentWeightInput, setCurrentWeightInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [healthIssuesInput, setHealthIssuesInput] = useState("");
  const [allergiesInput, setAllergiesInput] = useState("");
  const [assistantHydrated, setAssistantHydrated] = useState(false);
  const objectiveStepLoadedRef = useRef(false);
  const weightInitForObjectiveStepRef = useRef(false);
  const stepRef = useRef<AssistantStep>(0);
  const skipNextRestoreRef = useRef(false);

  stepRef.current = step;

  const advanceStep = useCallback((next: AssistantStep) => {
    skipNextRestoreRef.current = true;
    setStep(next);
  }, []);

  const {
    user,
    measurementFields,
    displayValues,
    handleMeasurementChange,
    saveMeasurements,
    isSaving,
    loadUserData,
  } = useMeasurementsEditor();

  useEffect(() => {
    if (!visible) {
      setCountryInput("");
      setHealthIssuesInput("");
      setAllergiesInput("");
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      objectiveStepLoadedRef.current = false;
      weightInitForObjectiveStepRef.current = false;
      setAssistantHydrated(false);
      skipNextRestoreRef.current = false;
      return;
    }
    skipNextRestoreRef.current = false;
    if (!authUser?.id) {
      setAssistantHydrated(true);
      return;
    }
    let cancelled = false;
    void assistantSetupStorage.getStep(authUser.id).then((saved) => {
      if (cancelled) return;
      if (!skipNextRestoreRef.current && saved != null) {
        let s = saved as AssistantStep;
        if (s === 4) s = 3;
        setStep(s);
      }
      setAssistantHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [visible, authUser?.id]);

  useEffect(() => {
    if (visible || !authUser?.id) return;
    void assistantSetupStorage.setStep(
      authUser.id,
      toPersistedAssistantStep(stepRef.current),
    );
  }, [visible, authUser?.id]);

  useEffect(() => {
    if (!visible || !authUser?.id || !assistantHydrated) return;
    void assistantSetupStorage.setStep(
      authUser.id,
      toPersistedAssistantStep(step),
    );
  }, [visible, authUser?.id, assistantHydrated, step]);

  useEffect(() => {
    if (step !== 2) {
      weightInitForObjectiveStepRef.current = false;
      return;
    }
    if (!visible) return;
    if (weightInitForObjectiveStepRef.current) return;
    weightInitForObjectiveStepRef.current = true;
    const w = user?.measurements?.weight;
    if (w != null && typeof w === "number" && w > 0) {
      const c = convertWeight(w);
      setCurrentWeightInput(c.value.toString());
    } else {
      setCurrentWeightInput("");
    }
  }, [visible, step, user?.measurements?.weight, convertWeight]);

  useEffect(() => {
    if (visible && step === 1) {
      void loadUserData();
    }
  }, [visible, step, loadUserData]);

  useEffect(() => {
    if (step !== 2) {
      objectiveStepLoadedRef.current = false;
      return;
    }
    if (!visible) return;
    if (objectiveStepLoadedRef.current) return;
    objectiveStepLoadedRef.current = true;
    void goalsService.getGoals().then((g) => {
      setSelectedObjective(g?.objective);
    });
  }, [visible, step]);

  useEffect(() => {
    if (step !== 4) return;
    setPlanGenIconSport(true);
    const id = setInterval(() => {
      setPlanGenIconSport((v) => !v);
    }, 850);
    return () => clearInterval(id);
  }, [step]);

  const discardAssistantProgressAndClose = () => {
    if (authUser?.id) void assistantSetupStorage.clear(authUser.id);
    setStep(0);
    onCancel();
  };

  const handleAssistantRequestClose = () => {
    if (step === 0) {
      discardAssistantProgressAndClose();
    } else {
      onCancel();
    }
  };

  const handleAssistantComplete = () => {
    if (authUser?.id) void assistantSetupStorage.clear(authUser.id);
    setStep(0);
    onCancel();
  };

  const handleIntroContinue = () => {
    advanceStep(1);
  };

  const handleMeasurementsContinue = async () => {
    const ok = await saveMeasurements();
    if (ok) {
      advanceStep(2);
    }
  };

  const handleBackFromMeasurements = () => {
    advanceStep(0);
  };

  const handleBackFromObjective = () => {
    advanceStep(1);
  };

  const handleBackFromProfile = () => {
    advanceStep(2);
  };

  const handleProfileContinue = async () => {
    const trimmedCountry = countryInput.trim();
    if (!trimmedCountry) {
      showError(t("home.assistantCountryRequired"));
      return;
    }
    advanceStep(4);
    try {
      const language = getCurrentLanguage() || "en";
      await userService.generateFullPlan({
        health_issues: healthIssuesInput.trim(),
        allergies: allergiesInput.trim(),
        language,
        country: trimmedCountry,
      });
      advanceStep(5);
    } catch (e) {
      console.error(e);
      advanceStep(3);
      showError(t("home.assistantGeneratePlanError"));
    }
  };

  const handleObjectiveContinue = async () => {
    if (!selectedObjective) {
      showError(t("goals.selectObjectiveRequired"));
      return;
    }
    const trimmed = currentWeightInput.trim();
    if (!trimmed) {
      showError(t("weight.weightRequired"));
      return;
    }
    let weightKg = parseFloat(trimmed.replace(",", "."));
    if (isNaN(weightKg) || weightKg <= 0) {
      showError(t("weight.weightInvalid"));
      return;
    }
    if (unitSystem === "imperial") {
      weightKg = weightKg / 2.205;
    }
    if (weightKg < 30) {
      showError(t("measurements.validation.weightMin"));
      return;
    }
    if (weightKg > 300) {
      showError(t("measurements.validation.weightMax"));
      return;
    }
    const clientId = authUser?.id ?? user?.id;
    if (!clientId) {
      showError(t("goals.saveError"));
      return;
    }
    setIsSavingObjective(true);
    try {
      const existing = (await goalsService.getGoals()) ?? {};
      const goals: Goals = {
        ...existing,
        objective: selectedObjective,
      };
      const goalsForAPI = {
        ...goals,
        objective: convertObjectiveForAPI(goals.objective),
      };
      await userService.updateProfile({
        goals: goalsForAPI as any,
      });
      await userService.updateUserMeasurement(clientId, weightKg);
      await goalsService.saveGoals(goals);
      const fresh = await userService.getProfile();
      if (fresh) {
        updateUser(fresh);
      }
      advanceStep(3);
    } catch (e) {
      console.error(e);
      showError(t("goals.saveError"));
    } finally {
      setIsSavingObjective(false);
    }
  };

  const gradientBg = (
    <LinearGradient
      colors={[
        "rgba(173, 209, 0, 0.18)",
        "transparent",
        "rgba(0, 232, 212, 0.08)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleAssistantRequestClose}
    >
      <StatusBar barStyle="light-content" />
      <Box flex={1} bg={FIXED_COLORS.background[50]}>
        {gradientBg}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <VStack
            flex={1}
            pt={insets.top + 12}
            px="$4"
            pb={insets.bottom + 16}
          >
            {step === 0 ? (
              <>
                <HStack justifyContent="center" mb="$6">
                  <Box
                    width={56}
                    height={56}
                    borderRadius="$full"
                    bg={FIXED_COLORS.background[800]}
                    borderWidth={1}
                    borderColor={FIXED_COLORS.primary[600]}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons
                      name="sparkles"
                      size={28}
                      color={FIXED_COLORS.secondary[300]}
                    />
                  </Box>
                </HStack>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 16,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$2xl"
                    fontWeight="$bold"
                    textAlign="center"
                    px="$2"
                  >
                    {t("home.assistantModalTitle")}
                  </Text>
                  <Text
                    color={FIXED_COLORS.text[300]}
                    fontSize="$md"
                    textAlign="center"
                    mt="$5"
                    lineHeight={24}
                    px="$3"
                  >
                    {t("home.assistantModalDescription")}
                  </Text>
                </ScrollView>
                <VStack space="md" width="100%">
                  <Button
                    onPress={handleIntroContinue}
                    bg={FIXED_COLORS.warning[500]}
                    borderRadius="$xl"
                    size="lg"
                  >
                    <ButtonText
                      color={FIXED_COLORS.text[950]}
                      fontWeight="$bold"
                      fontSize="$md"
                    >
                      {t("home.assistantModalContinue")}
                    </ButtonText>
                  </Button>
                  <Button
                    onPress={discardAssistantProgressAndClose}
                    variant="outline"
                    borderColor={FIXED_COLORS.background[600]}
                    borderRadius="$xl"
                    size="lg"
                  >
                    <ButtonText
                      color={FIXED_COLORS.text[200]}
                      fontWeight="$semibold"
                      fontSize="$md"
                    >
                      {t("home.assistantModalCancel")}
                    </ButtonText>
                  </Button>
                </VStack>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <Pressable
                  onPress={handleBackFromMeasurements}
                  hitSlop={12}
                  mb="$3"
                  alignSelf="flex-start"
                >
                  <HStack alignItems="center" space="xs">
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={FIXED_COLORS.primary[500]}
                    />
                    <Text
                      color={FIXED_COLORS.primary[500]}
                      fontSize="$md"
                      fontWeight="$semibold"
                    >
                      {t("home.assistantModalBack")}
                    </Text>
                  </HStack>
                </Pressable>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  mb="$2"
                  px="$1"
                >
                  {t("home.assistantMeasurementsStepHint")}
                </Text>
                <Box flex={1} minHeight={0}>
                  <MeasurementsEditorContent
                    layout="modal"
                    user={user}
                    measurementFields={measurementFields}
                    displayValues={displayValues}
                    onFieldChange={handleMeasurementChange}
                    convertHeight={convertHeight}
                    convertBodyMeasurement={convertBodyMeasurement}
                    scrollBottomPadding={16}
                  />
                </Box>
                <VStack width="100%" pt="$3">
                  <Button
                    onPress={() => {
                      void handleMeasurementsContinue();
                    }}
                    bg={FIXED_COLORS.warning[500]}
                    borderRadius="$xl"
                    size="lg"
                    isDisabled={isSaving}
                  >
                    <ButtonText
                      color={FIXED_COLORS.text[950]}
                      fontWeight="$bold"
                      fontSize="$md"
                    >
                      {isSaving
                        ? t("common.saving")
                        : t("home.assistantModalContinue")}
                    </ButtonText>
                  </Button>
                </VStack>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Pressable
                  onPress={handleBackFromObjective}
                  hitSlop={12}
                  mb="$3"
                  alignSelf="flex-start"
                >
                  <HStack alignItems="center" space="xs">
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={FIXED_COLORS.primary[500]}
                    />
                    <Text
                      color={FIXED_COLORS.primary[500]}
                      fontSize="$md"
                      fontWeight="$semibold"
                    >
                      {t("home.assistantModalBack")}
                    </Text>
                  </HStack>
                </Pressable>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  mb="$2"
                  px="$1"
                >
                  {t("home.assistantObjectiveStepHint")}
                </Text>
                <Box flex={1} minHeight={0}>
                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: 16,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <ObjectiveSelector
                      selected={selectedObjective}
                      onSelect={setSelectedObjective}
                    />
                    <VStack
                      mt="$4"
                      borderWidth={1}
                      borderColor={FIXED_COLORS.background[0]}
                      borderRadius="$xl"
                      bg="rgba(0, 0, 0, 0.6)"
                      overflow="hidden"
                    >
                      <Box padding="$2" bg="rgba(0, 0, 0, 0.35)">
                        <Text
                          color={FIXED_COLORS.background[0]}
                          fontSize="$md"
                          fontWeight="$bold"
                          mb="$3"
                        >
                          {t("weight.currentWeight")}
                        </Text>
                        <HStack
                          bg={
                            currentWeightInput.trim().length > 0
                              ? FIXED_COLORS.primary[600]
                              : "rgba(0, 0, 0, 0.5)"
                          }
                          p="$3"
                          borderRadius="$lg"
                          alignItems="center"
                          space="sm"
                        >
                          <MaterialCommunityIcons
                            name="scale-bathroom"
                            size={24}
                            color={FIXED_COLORS.background[0]}
                          />
                          <TextInput
                            value={currentWeightInput}
                            onChangeText={setCurrentWeightInput}
                            placeholder={t("weight.weightPlaceholder")}
                            placeholderTextColor="rgba(255, 255, 255, 0.45)"
                            keyboardType="decimal-pad"
                            style={{
                              flex: 1,
                              minHeight: 24,
                              color: FIXED_COLORS.background[0],
                              fontSize: 16,
                              fontWeight:
                                currentWeightInput.trim().length > 0
                                  ? "700"
                                  : "400",
                            }}
                          />
                          <Text
                            color={FIXED_COLORS.background[0]}
                            fontSize="$md"
                            fontWeight={
                              currentWeightInput.trim().length > 0
                                ? "$bold"
                                : "$normal"
                            }
                          >
                            {convertWeight(1).unit}
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </ScrollView>
                </Box>
                <VStack width="100%" pt="$3">
                  <Button
                    onPress={() => {
                      void handleObjectiveContinue();
                    }}
                    bg={FIXED_COLORS.warning[500]}
                    borderRadius="$xl"
                    size="lg"
                    isDisabled={isSavingObjective}
                  >
                    <ButtonText
                      color={FIXED_COLORS.text[950]}
                      fontWeight="$bold"
                      fontSize="$md"
                    >
                      {isSavingObjective
                        ? t("common.saving")
                        : t("home.assistantModalContinue")}
                    </ButtonText>
                  </Button>
                </VStack>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <Pressable
                  onPress={handleBackFromProfile}
                  hitSlop={12}
                  mb="$3"
                  alignSelf="flex-start"
                >
                  <HStack alignItems="center" space="xs">
                    <Ionicons
                      name="chevron-back"
                      size={22}
                      color={FIXED_COLORS.primary[500]}
                    />
                    <Text
                      color={FIXED_COLORS.primary[500]}
                      fontSize="$md"
                      fontWeight="$semibold"
                    >
                      {t("home.assistantModalBack")}
                    </Text>
                  </HStack>
                </Pressable>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  mb="$4"
                  px="$1"
                  lineHeight={22}
                >
                  {t("home.assistantProfileStepHint")}
                </Text>
                <Box flex={1} minHeight={0}>
                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingBottom: 16,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <VStack space="md">
                      <VStack
                        borderWidth={1}
                        borderColor={FIXED_COLORS.background[0]}
                        borderRadius="$xl"
                        bg="rgba(0, 0, 0, 0.6)"
                        overflow="hidden"
                      >
                        <Box padding="$3" bg="rgba(0, 0, 0, 0.35)">
                          <Text
                            color={FIXED_COLORS.background[0]}
                            fontSize="$md"
                            fontWeight="$bold"
                            mb="$3"
                          >
                            {t("home.assistantCountryLabel")}
                          </Text>
                          <HStack
                            bg={
                              countryInput.trim().length > 0
                                ? FIXED_COLORS.primary[600]
                                : "rgba(0, 0, 0, 0.5)"
                            }
                            p="$3"
                            borderRadius="$lg"
                            alignItems="center"
                            space="sm"
                          >
                            <MaterialCommunityIcons
                              name="earth"
                              size={24}
                              color={FIXED_COLORS.background[0]}
                            />
                            <TextInput
                              value={countryInput}
                              onChangeText={setCountryInput}
                              placeholder={t(
                                "home.assistantCountryPlaceholder"
                              )}
                              placeholderTextColor="rgba(255, 255, 255, 0.45)"
                              autoCapitalize="words"
                              style={{
                                flex: 1,
                                minHeight: 24,
                                color: FIXED_COLORS.background[0],
                                fontSize: 16,
                                fontWeight:
                                  countryInput.trim().length > 0
                                    ? "700"
                                    : "400",
                              }}
                            />
                          </HStack>
                        </Box>
                      </VStack>
                      <VStack
                        borderWidth={1}
                        borderColor={FIXED_COLORS.background[600]}
                        borderRadius="$xl"
                        bg={FIXED_COLORS.background[800]}
                        p="$3"
                        space="sm"
                      >
                        <Text
                          color={FIXED_COLORS.text[50]}
                          fontSize="$md"
                          fontWeight="$bold"
                        >
                          {t("home.assistantHealthIssuesLabel")}
                        </Text>
                        <Text
                          color={FIXED_COLORS.text[400]}
                          fontSize="$xs"
                          lineHeight={18}
                        >
                          {t("home.assistantHealthIssuesHint")}
                        </Text>
                        <TextInput
                          value={healthIssuesInput}
                          onChangeText={setHealthIssuesInput}
                          placeholder={t(
                            "home.assistantHealthIssuesPlaceholder"
                          )}
                          placeholderTextColor={FIXED_COLORS.text[500]}
                          multiline
                          textAlignVertical="top"
                          style={{
                            minHeight: 100,
                            padding: 12,
                            borderRadius: 12,
                            backgroundColor: FIXED_COLORS.background[700],
                            color: FIXED_COLORS.text[50],
                            fontSize: 15,
                          }}
                        />
                      </VStack>
                      <VStack
                        borderWidth={1}
                        borderColor={FIXED_COLORS.background[600]}
                        borderRadius="$xl"
                        bg={FIXED_COLORS.background[800]}
                        p="$3"
                        space="sm"
                      >
                        <Text
                          color={FIXED_COLORS.text[50]}
                          fontSize="$md"
                          fontWeight="$bold"
                        >
                          {t("home.assistantAllergiesLabel")}
                        </Text>
                        <Text
                          color={FIXED_COLORS.text[400]}
                          fontSize="$xs"
                          lineHeight={18}
                        >
                          {t("home.assistantAllergiesHint")}
                        </Text>
                        <TextInput
                          value={allergiesInput}
                          onChangeText={setAllergiesInput}
                          placeholder={t(
                            "home.assistantAllergiesPlaceholder"
                          )}
                          placeholderTextColor={FIXED_COLORS.text[500]}
                          multiline
                          textAlignVertical="top"
                          style={{
                            minHeight: 100,
                            padding: 12,
                            borderRadius: 12,
                            backgroundColor: FIXED_COLORS.background[700],
                            color: FIXED_COLORS.text[50],
                            fontSize: 15,
                          }}
                        />
                      </VStack>
                    </VStack>
                  </ScrollView>
                </Box>
                <VStack width="100%" pt="$3">
                  <Button
                    onPress={() => {
                      void handleProfileContinue();
                    }}
                    bg={FIXED_COLORS.warning[500]}
                    borderRadius="$xl"
                    size="lg"
                  >
                    <ButtonText
                      color={FIXED_COLORS.text[950]}
                      fontWeight="$bold"
                      fontSize="$md"
                    >
                      {t("home.assistantCreateFullPlanCta")}
                    </ButtonText>
                  </Button>
                </VStack>
              </>
            ) : null}

            {step === 4 ? (
              <Box flex={1} justifyContent="center" px="$2">
                <HStack justifyContent="center" mb="$6">
                  <Box
                    width={88}
                    height={88}
                    borderRadius="$full"
                    bg={FIXED_COLORS.background[800]}
                    borderWidth={1}
                    borderColor={FIXED_COLORS.primary[600]}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {planGenIconSport ? (
                      <Ionicons
                        name="barbell"
                        size={40}
                        color={FIXED_COLORS.secondary[300]}
                      />
                    ) : (
                      <Ionicons
                        name="restaurant"
                        size={40}
                        color={FIXED_COLORS.secondary[300]}
                      />
                    )}
                  </Box>
                </HStack>
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$2xl"
                  fontWeight="$bold"
                  textAlign="center"
                >
                  {t("home.assistantAnalyzingGoalsTitle")}
                </Text>
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$md"
                  textAlign="center"
                  mt="$4"
                  lineHeight={24}
                >
                  {t("home.assistantAnalyzingGoalsSubtitle")}
                </Text>
              </Box>
            ) : null}

            {step === 5 ? (
              <>
                <Box flex={1} justifyContent="center" px="$2">
                  <HStack justifyContent="center" mb="$6">
                    <Box
                      width={56}
                      height={56}
                      borderRadius="$full"
                      bg={FIXED_COLORS.background[800]}
                      borderWidth={1}
                      borderColor={FIXED_COLORS.success[500]}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={32}
                        color={FIXED_COLORS.success[500]}
                      />
                    </Box>
                  </HStack>
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$2xl"
                    fontWeight="$bold"
                    textAlign="center"
                  >
                    {t("home.assistantSetupCompleteTitle")}
                  </Text>
                  <Text
                    color={FIXED_COLORS.text[400]}
                    fontSize="$md"
                    textAlign="center"
                    mt="$4"
                    lineHeight={24}
                  >
                    {t("home.assistantSetupCompleteSubtitle")}
                  </Text>
                </Box>
                <Button
                  onPress={handleAssistantComplete}
                  bg={FIXED_COLORS.warning[500]}
                  borderRadius="$xl"
                  size="lg"
                >
                  <ButtonText
                    color={FIXED_COLORS.text[950]}
                    fontWeight="$bold"
                    fontSize="$md"
                  >
                    {t("home.assistantFinish")}
                  </ButtonText>
                </Button>
              </>
            ) : null}
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
};
