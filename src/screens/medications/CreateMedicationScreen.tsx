import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Pressable,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeContainer, CustomDrawer } from "../../components";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useToast } from "../../hooks/useToast";
import { medicationsService } from "../../services/medicationsService";
import { notificationService } from "../../services/notificationService";
import { LocalNotification } from "../../types/notifications";
import { Medication } from "./types";

export const CreateMedicationScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccess, showError } = useToast();
  const medication = (route.params as any)?.medication as
    | Medication
    | undefined;

  const [formData, setFormData] = useState({
    name: "",
    time: "",
    amount: "",
    frequency: "",
    protein: "",
    carbohydrates: "",
    calories: "",
    description: "",
    is_active: true,
  });

  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMedicationData = async () => {
      if (medication) {
        setFormData({
          name: medication.name || "",
          time: medication.time || "",
          amount: medication.amount || "",
          frequency: medication.frequency || "",
          protein: medication.protein || "",
          carbohydrates: medication.carbohydrates || "",
          calories: medication.calories || "",
          description: medication.description || "",
          is_active: medication.is_active,
        });

        // Buscar notificações existentes para este suplemento
        try {
          const allNotifications =
            await notificationService.getAllScheduledNotifications();
          const medicationNotifications = allNotifications.filter(
            (n) => n.data?.medicationId === medication.id
          );

          if (medicationNotifications.length > 0) {
            const times = medicationNotifications
              .map((n) => n.data?.time)
              .filter((t): t is string => !!t)
              .sort();
            setReminderTimes(times);
          }
        } catch (error) {}
      }
    };

    loadMedicationData();
  }, [medication]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddReminderTime = () => {
    setShowTimePicker(true);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    const isAndroid = Platform.OS === "android";

    // Android: Fechar automaticamente e adicionar se confirmou
    if (isAndroid) {
      setShowTimePicker(false);

      if (event.type === "set" && selectedDate) {
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}`;

        if (!reminderTimes.includes(timeString)) {
          setReminderTimes([...reminderTimes, timeString]);
        }
      }
      return;
    }

    // iOS: Apenas atualiza o selectedTime enquanto o usuário rola
    if (selectedDate) {
      setSelectedTime(selectedDate);
    }
  };

  const handleConfirmTime = () => {
    const hours = selectedTime.getHours().toString().padStart(2, "0");
    const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    if (!reminderTimes.includes(timeString)) {
      setReminderTimes([...reminderTimes, timeString]);
    }

    setShowTimePicker(false);
  };

  const handleRemoveReminderTime = (time: string) => {
    setReminderTimes(reminderTimes.filter((t) => t !== time));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validação básica
      if (!formData.name.trim()) {
        showError(t("medications.errors.nameRequired"));
        return;
      }

      if (!formData.amount.trim()) {
        showError(t("medications.errors.amountRequired"));
        return;
      }

      if (!formData.frequency.trim()) {
        showError(t("medications.errors.frequencyRequired"));
        return;
      }

      // Preparar dados para API
      const dataToSend = {
        name: formData.name,
        time: formData.time || "Não definido", // Campo para período do dia (manhã, tarde, noite)
        amount: formData.amount,
        frequency: formData.frequency,
        protein: formData.protein || undefined,
        carbohydrates: formData.carbohydrates || undefined,
        calories: formData.calories || undefined,
        description: formData.description || undefined,
        is_active: true,
      };

      // Edição ou criação
      let resultMedication;
      if (medication?.id) {
        resultMedication = await medicationsService.updateMedication(
          medication.id,
          dataToSend
        );
      } else {
        resultMedication = await medicationsService.createMedication(
          dataToSend
        );
      }

      // Gerenciar notificações (criar/atualizar/excluir)
      if (resultMedication.id) {
        try {
          // Se estiver editando, cancelar todas as notificações antigas deste suplemento
          if (medication?.id) {
            const allNotifications =
              await notificationService.getAllScheduledNotifications();
            const medicationNotifications = allNotifications.filter(
              (n) => n.data?.medicationId === medication.id
            );

            for (const notif of medicationNotifications) {
              await notificationService.cancelNotification(notif.id);
            }
          }

          // Criar novas notificações se houver lembretes
          if (reminderTimes.length > 0) {
            for (const time of reminderTimes) {
              const [hours, minutes] = time.split(":").map(Number);

              const notification: LocalNotification = {
                id: "", // Será gerado pelo notificationService
                title: "Hora de tomar seu suplemento! 💊",
                body: `Não esqueça de tomar ${resultMedication.name}`,
                scheduledTime: new Date(), // Será calculado pelo notificationService
                isActive: true,
                data: {
                  type: "medication",
                  medicationId: resultMedication.id,
                  medicationName: resultMedication.name,
                  time: time,
                  isRecurring: true, // Marcar como recorrente
                },
              };

              await notificationService.scheduleDailyNotification(
                notification,
                hours,
                minutes
              );
            }
          } else if (medication?.id) {
          }
        } catch (notificationError) {
          // Não bloqueamos o fluxo se a notificação falhar
        }
      }

      // Log de todas as notificações agendadas no sistema
      try {
        const allScheduledNotifications =
          await notificationService.getAllScheduledNotifications();
        allScheduledNotifications.forEach((notif, index) => {
          if (notif.data?.medicationId) {
          }
        });
      } catch (error) {}

      showSuccess(
        medication?.id
          ? t("medications.success.updated")
          : t("medications.success.created")
      );
      navigation.goBack();
    } catch (error) {
      showError(t("medications.errors.createError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeContainer paddingTop={12} paddingBottom={0} paddingHorizontal={0}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack space="lg" px="$4">
            {/* Header */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$2xl"
                fontWeight="$bold"
              >
                {medication?.id
                  ? t("medications.edit.title")
                  : t("medications.create.title")}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                {medication?.id
                  ? t("medications.edit.description")
                  : t("medications.create.description")}
              </Text>
            </VStack>

            {/* Campos da API */}
            <VStack space="md">
              {/* Nome */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("medications.create.name")} *
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t("medications.create.placeholders.name")}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange("name", value)}
                    color={FIXED_COLORS.text[50]}
                  />
                </Input>
              </VStack>

              {/* Time (Horário) */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("medications.create.time")}
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t("medications.create.placeholders.time")}
                    value={formData.time}
                    onChangeText={(value) => handleInputChange("time", value)}
                    color={FIXED_COLORS.text[50]}
                  />
                </Input>
              </VStack>

              {/* Amount (Dosagem) */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("medications.create.amount")} *
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t("medications.create.placeholders.amount")}
                    value={formData.amount}
                    onChangeText={(value) => handleInputChange("amount", value)}
                    color={FIXED_COLORS.text[50]}
                  />
                </Input>
              </VStack>

              {/* Frequency */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("medications.create.frequency")} *
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t("medications.create.placeholders.frequency")}
                    value={formData.frequency}
                    onChangeText={(value) =>
                      handleInputChange("frequency", value)
                    }
                    color={FIXED_COLORS.text[50]}
                  />
                </Input>
              </VStack>

              {/* Description */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("medications.create.descriptionLabel")}
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                  height={100}
                >
                  <InputField
                    placeholder={t(
                      "medications.create.placeholders.description"
                    )}
                    value={formData.description}
                    onChangeText={(value) =>
                      handleInputChange("description", value)
                    }
                    color={FIXED_COLORS.text[50]}
                    multiline
                    numberOfLines={4}
                    style={{ height: 90, textAlignVertical: "top" }}
                  />
                </Input>
              </VStack>
            </VStack>

            {/* Lembretes / Notificações */}
            <VStack space="md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$lg"
                  fontWeight="$semibold"
                >
                  {t("medications.create.reminders")}
                </Text>
                <Button
                  size="sm"
                  bg={FIXED_COLORS.primary[600]}
                  onPress={handleAddReminderTime}
                >
                  <HStack alignItems="center" space="xs">
                    <Ionicons
                      name="add"
                      size={16}
                      color={FIXED_COLORS.text[50]}
                    />
                    <ButtonText color={FIXED_COLORS.text[50]}>
                      {t("medications.create.addReminder")}
                    </ButtonText>
                  </HStack>
                </Button>
              </HStack>

              {reminderTimes.length > 0 ? (
                <VStack space="sm">
                  {reminderTimes.map((time, index) => (
                    <HStack
                      key={index}
                      bg={FIXED_COLORS.background[800]}
                      p="$3"
                      borderRadius="$md"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack alignItems="center" space="sm">
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color={FIXED_COLORS.primary[500]}
                        />
                        <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                          {time}
                        </Text>
                      </HStack>
                      <Pressable onPress={() => handleRemoveReminderTime(time)}>
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color={FIXED_COLORS.error[500]}
                        />
                      </Pressable>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                  {t("medications.create.noReminders")}
                </Text>
              )}

              {showTimePicker && Platform.OS === "android" && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </VStack>

            {/* Drawer para iOS */}
            {Platform.OS === "ios" && (
              <CustomDrawer
                isOpen={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                minHeight={450}
              >
                <VStack
                  space="lg"
                  p="$4"
                  width="$full"
                  flex={1}
                  justifyContent="space-between"
                >
                  {/* Header */}
                  <Text
                    color={FIXED_COLORS.text[50]}
                    fontSize="$xl"
                    fontWeight="$bold"
                    textAlign="center"
                  >
                    {t("medications.create.selectTime")}
                  </Text>

                  {/* Time Picker Centralizado */}
                  <VStack flex={1} justifyContent="center" alignItems="center">
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      is24Hour={true}
                      display="spinner"
                      onChange={handleTimeChange}
                      textColor={FIXED_COLORS.text[50]}
                    />
                  </VStack>

                  {/* Botões */}
                  <VStack space="sm">
                    <Button
                      onPress={handleConfirmTime}
                      bg={FIXED_COLORS.primary[600]}
                      borderRadius="$md"
                    >
                      <ButtonText
                        color={FIXED_COLORS.text[50]}
                        fontWeight="$bold"
                      >
                        {t("common.confirm")}
                      </ButtonText>
                    </Button>
                    <Button
                      onPress={() => setShowTimePicker(false)}
                      bg={FIXED_COLORS.background[700]}
                      borderRadius="$md"
                      variant="outline"
                      borderColor={FIXED_COLORS.background[600]}
                    >
                      <ButtonText color={FIXED_COLORS.text[300]}>
                        {t("common.cancel")}
                      </ButtonText>
                    </Button>
                  </VStack>
                </VStack>
              </CustomDrawer>
            )}

            {/* Botões de ação */}
            <VStack space="sm" mt="$6">
              <Button
                onPress={handleSubmit}
                bg={FIXED_COLORS.primary[500]}
                borderRadius="$md"
                isDisabled={isLoading}
              >
                <ButtonText
                  color={FIXED_COLORS.text[50]}
                  fontSize="$md"
                  fontWeight="$semibold"
                >
                  {isLoading
                    ? t("common.saving")
                    : medication?.id
                    ? t("medications.create.updateButton")
                    : t("medications.create.createButton")}
                </ButtonText>
              </Button>

              <Button
                onPress={() => navigation.goBack()}
                bg={FIXED_COLORS.background[700]}
                borderRadius="$md"
                variant="outline"
                borderColor={FIXED_COLORS.background[600]}
              >
                <ButtonText
                  color={FIXED_COLORS.text[300]}
                  fontSize="$md"
                  fontWeight="$medium"
                >
                  {t("common.cancel")}
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};
