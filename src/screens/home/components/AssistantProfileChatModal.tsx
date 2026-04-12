import React, { useEffect, useRef, useCallback } from "react";
import {
  Modal,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { Measurements } from "../../../types/auth";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../contexts/AuthContext";
import { assistantSetupStorage } from "../../../services/assistantSetupStorage";
import { useAssistantProfileChat } from "../assistant/useAssistantProfileChat";

interface AssistantProfileChatModalProps {
  visible: boolean;
  onCancel: () => void;
  onFlowComplete?: () => void;
}

export const AssistantProfileChatModal: React.FC<
  AssistantProfileChatModalProps
> = ({ visible, onCancel, onFlowComplete }) => {
  const { t, getCurrentLanguage } = useTranslation();
  const insets = useSafeAreaInsets();
  const { showSuccess, showError } = useToast();
  const { updateUser, user: authUser } = useAuth();
  const {
    convertInputToMetric,
    getUnitForMeasurement,
    convertWeight,
    convertHeight,
    convertBodyMeasurement,
  } = useUnits();
  const scrollRef = useRef<ScrollView>(null);

  const translateMeasurementLabel = (key: keyof Measurements) => {
    if (key === "weight") return t("weight.currentWeight");
    return t(`measurements.${String(key)}.label`);
  };

  const measurementUnitLabel = (key: keyof Measurements) => {
    if (key === "height") return getUnitForMeasurement("height");
    if (key === "weight") return convertWeight(1).unit;
    return getUnitForMeasurement("body");
  };

  const metricToDisplayInput = useCallback(
    (key: keyof Measurements, metric: number) => {
      if (key === "height") return String(convertHeight(metric).value);
      if (key === "weight") return String(convertWeight(metric).value);
      return String(convertBodyMeasurement(metric).value);
    },
    [convertHeight, convertWeight, convertBodyMeasurement]
  );

  const chat = useAssistantProfileChat({
    visible,
    t,
    showError,
    showSuccess,
    updateUser,
    getCurrentLanguage,
    onFlowComplete,
    assistantUserId: authUser?.id ?? null,
    translateMeasurementLabel,
    measurementUnitLabel,
    convertInputToMetric,
    metricToDisplayInput,
  });

  useEffect(() => {
    if (!visible || chat.messages.length === 0) return;
    const id = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(id);
  }, [visible, chat.messages]);

  const handleClose = () => {
    onCancel();
  };

  const handleComplete = () => {
    if (authUser?.id) void assistantSetupStorage.clear(authUser.id);
    onCancel();
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
      onRequestClose={handleClose}
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
            pb={insets.bottom + 12}
          >
            <HStack
              alignItems="center"
              justifyContent="space-between"
              mb="$3"
            >
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$bold"
                flex={1}
              >
                {t("home.assistantChat.headerTitle")}
              </Text>
              <Pressable onPress={handleClose} hitSlop={12} p="$2">
                <Ionicons
                  name="close"
                  size={26}
                  color={FIXED_COLORS.text[200]}
                />
              </Pressable>
            </HStack>

            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingBottom: 16,
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <VStack space="md">
                {chat.messages.map((msg) => (
                  <HStack
                    key={msg.id}
                    justifyContent={
                      msg.role === "user" ? "flex-end" : "flex-start"
                    }
                  >
                    <Box
                      maxWidth="88%"
                      bg={
                        msg.role === "user"
                          ? FIXED_COLORS.primary[600]
                          : FIXED_COLORS.background[800]
                      }
                      px="$3"
                      py="$2"
                      borderRadius="$xl"
                      borderWidth={msg.role === "assistant" ? 1 : 0}
                      borderColor={FIXED_COLORS.background[700]}
                    >
                      <Text
                        color={
                          msg.role === "user"
                            ? FIXED_COLORS.text[950]
                            : FIXED_COLORS.text[50]
                        }
                        fontSize="$sm"
                        lineHeight={22}
                      >
                        {msg.text}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </ScrollView>

            <VStack space="sm" mt="$2">
              {chat.phaseGenerating ? (
                <HStack
                  alignItems="center"
                  justifyContent="center"
                  space="md"
                  py="$4"
                >
                  <ActivityIndicator
                    color={FIXED_COLORS.secondary[300]}
                    size="small"
                  />
                  <Text color={FIXED_COLORS.text[300]} fontSize="$sm">
                    {t("home.assistantChat.generatingPlanWait")}
                  </Text>
                </HStack>
              ) : null}

              {!chat.phaseGenerating && chat.phaseWelcome ? (
                <Button
                  onPress={chat.startChat}
                  bg={FIXED_COLORS.warning[500]}
                  borderRadius="$xl"
                  size="lg"
                >
                  <ButtonText
                    color={FIXED_COLORS.text[950]}
                    fontWeight="$bold"
                    fontSize="$md"
                  >
                    {t("home.assistantChat.startButton")}
                  </ButtonText>
                </Button>
              ) : null}

              {!chat.phaseGenerating && chat.chips ? (
                <VStack space="xs">
                  {chat.chips.map((c) => (
                    <Pressable
                      key={c.value}
                      onPress={() => chat.selectChip(c.value, c.label)}
                      bg={FIXED_COLORS.background[800]}
                      borderWidth={1}
                      borderColor={FIXED_COLORS.background[600]}
                      borderRadius="$lg"
                      p="$3"
                    >
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize="$sm"
                        fontWeight="$medium"
                      >
                        {c.label}
                      </Text>
                    </Pressable>
                  ))}
                </VStack>
              ) : null}

              {!chat.phaseGenerating && chat.phaseWorkoutType ? (
                <VStack space="xs">
                  {chat.workoutChips.map((c) => {
                    const on = chat.workoutSelection.includes(c.value);
                    return (
                      <Pressable
                        key={c.value}
                        onPress={() => chat.toggleWorkout(c.value)}
                        bg={
                          on
                            ? FIXED_COLORS.primary[700]
                            : FIXED_COLORS.background[800]
                        }
                        borderWidth={1}
                        borderColor={
                          on
                            ? FIXED_COLORS.primary[500]
                            : FIXED_COLORS.background[600]
                        }
                        borderRadius="$lg"
                        p="$3"
                      >
                        <Text
                          color={FIXED_COLORS.text[50]}
                          fontSize="$sm"
                          fontWeight="$medium"
                        >
                          {c.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Button
                    onPress={chat.confirmWorkouts}
                    bg={FIXED_COLORS.warning[500]}
                    borderRadius="$xl"
                    size="md"
                    mt="$2"
                  >
                    <ButtonText
                      color={FIXED_COLORS.text[950]}
                      fontWeight="$bold"
                    >
                      {t("home.assistantChat.confirmWorkouts")}
                    </ButtonText>
                  </Button>
                </VStack>
              ) : null}

              {!chat.phaseGenerating && chat.showTextInput ? (
                <VStack space="sm">
                  <TextInput
                    value={chat.inputText}
                    onChangeText={chat.setInputText}
                    placeholder={chat.textInputPlaceholder}
                    placeholderTextColor={FIXED_COLORS.text[500]}
                    keyboardType={chat.keyboardType as "default" | "decimal-pad"}
                    multiline={chat.textInputMultiline}
                    textAlignVertical={
                      chat.textInputMultiline ? "top" : "center"
                    }
                    style={{
                      minHeight: chat.textInputMultiline ? 88 : 48,
                      maxHeight: 160,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderRadius: 14,
                      backgroundColor: FIXED_COLORS.background[800],
                      color: FIXED_COLORS.text[50],
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: FIXED_COLORS.background[600],
                    }}
                  />
                  <Button
                    onPress={chat.sendText}
                    bg={FIXED_COLORS.primary[600]}
                    borderRadius="$xl"
                    size="md"
                  >
                    <ButtonText color={FIXED_COLORS.text[950]} fontWeight="$bold">
                      {t("home.assistantChat.sendAnswer")}
                    </ButtonText>
                  </Button>
                </VStack>
              ) : null}

              {!chat.phaseGenerating && chat.phaseFinalize ? (
                <Button
                  onPress={() => {
                    void chat.saveProfile();
                  }}
                  bg={FIXED_COLORS.warning[500]}
                  borderRadius="$xl"
                  size="lg"
                  isDisabled={chat.isSaving}
                >
                  <ButtonText
                    color={FIXED_COLORS.text[950]}
                    fontWeight="$bold"
                    fontSize="$md"
                  >
                    {chat.isSaving
                      ? t("home.assistantChat.savingProfileAndPlan")
                      : t("home.assistantChat.saveProfile")}
                  </ButtonText>
                </Button>
              ) : null}

              {!chat.phaseGenerating && chat.phaseDone ? (
                <Button
                  onPress={handleComplete}
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
              ) : null}
            </VStack>
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
};
