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
import { SafeContainer, CustomDrawer } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useToast } from "../../../../hooks/useToast";
import { supplementsService } from "../../../../services/supplementsService";
import { notificationService } from "../../../../services/notificationService";
import { LocalNotification } from "../../../../types/notifications";
import { Supplement } from "./types";

export const CreateSupplementScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccess, showError } = useToast();
  const supplement = (route.params as any)?.supplement as
    | Supplement
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
    const loadSupplementData = async () => {
      if (supplement) {
        setFormData({
          name: supplement.name || "",
          time: supplement.time || "",
          amount: supplement.amount || "",
          frequency: supplement.frequency || "",
          protein: supplement.protein || "",
          carbohydrates: supplement.carbohydrates || "",
          calories: supplement.calories || "",
          description: supplement.description || "",
          is_active: supplement.is_active,
        });

        // Buscar notificações existentes para este suplemento
        try {
          const allNotifications =
            await notificationService.getAllScheduledNotifications();
          const supplementNotifications = allNotifications.filter(
            (n) => n.data?.supplementId === supplement.id
          );

          if (supplementNotifications.length > 0) {
            const times = supplementNotifications
              .map((n) => n.data?.time)
              .filter((t): t is string => !!t)
              .sort();
            setReminderTimes(times);
          }
        } catch (error) {
          console.error("Error loading supplement notifications:", error);
        }
      }
    };

    loadSupplementData();
  }, [supplement]);

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
        showError(t("nutrition.supplements.errors.nameRequired"));
        return;
      }

      if (!formData.amount.trim()) {
        showError(t("nutrition.supplements.errors.amountRequired"));
        return;
      }

      if (!formData.frequency.trim()) {
        showError(t("nutrition.supplements.errors.frequencyRequired"));
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
      let resultSupplement;
      if (supplement?.id) {
        resultSupplement = await supplementsService.updateSupplement(
          supplement.id,
          dataToSend
        );
      } else {
        resultSupplement = await supplementsService.createSupplement(
          dataToSend
        );
      }

      // Gerenciar notificações (criar/atualizar/excluir)
      if (resultSupplement.id) {
        try {
          // Se estiver editando, cancelar todas as notificações antigas deste suplemento
          if (supplement?.id) {
            const allNotifications =
              await notificationService.getAllScheduledNotifications();
            const supplementNotifications = allNotifications.filter(
              (n) => n.data?.supplementId === supplement.id
            );

            for (const notif of supplementNotifications) {
              await notificationService.cancelNotification(notif.id);
            }
          }

          // Criar novas notificações se houver lembretes
          if (reminderTimes.length > 0) {
            for (const time of reminderTimes) {
              const [hours, minutes] = time.split(":").map(Number);

              const notification: LocalNotification = {
                id: "",
                title: "Hora de tomar seu suplemento! 💊",
                body: `Não esqueça de tomar ${resultSupplement.name}`,
                scheduledTime: new Date(),
                isActive: true,
                data: {
                  type: "supplement",
                  supplementId: resultSupplement.id,
                  supplementName: resultSupplement.name,
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
          } else if (supplement?.id) {
          }
        } catch (notificationError) {
          console.error(
            "[Notifications] Error managing notifications:",
            notificationError
          );
          // Não bloqueamos o fluxo se a notificação falhar
        }
      }

      // Log de todas as notificações agendadas no sistema
      try {
        const allScheduledNotifications =
          await notificationService.getAllScheduledNotifications();
        allScheduledNotifications.forEach((notif, index) => {
          if (notif.data?.supplementId) {
          }
        });
      } catch (error) {
        console.error("Erro ao listar notificações:", error);
      }

      showSuccess(
        supplement?.id
          ? t("nutrition.supplements.success.updated")
          : t("nutrition.supplements.success.created")
      );
      navigation.goBack();
    } catch (error) {
      console.error("Error creating supplement:", error);
      showError(t("nutrition.supplements.errors.createError"));
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
                {supplement?.id
                  ? t("nutrition.supplements.edit.title")
                  : t("nutrition.supplements.create.title")}
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                {supplement?.id
                  ? t("nutrition.supplements.edit.description")
                  : t("nutrition.supplements.create.description")}
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
                  {t("nutrition.supplements.create.name")} *
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.name"
                    )}
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
                  Horário
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder="Ex: Manhã, Tarde, Noite"
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
                  {t("nutrition.supplements.create.amount")} *
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.amount"
                    )}
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
                  {t("nutrition.supplements.create.frequency")} *
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.frequency"
                    )}
                    value={formData.frequency}
                    onChangeText={(value) =>
                      handleInputChange("frequency", value)
                    }
                    color={FIXED_COLORS.text[50]}
                  />
                </Input>
              </VStack>

              {/* Protein */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("nutrition.supplements.create.protein")}
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.protein"
                    )}
                    value={formData.protein}
                    onChangeText={(value) =>
                      handleInputChange("protein", value)
                    }
                    color={FIXED_COLORS.text[50]}
                    keyboardType="numeric"
                  />
                </Input>
              </VStack>

              {/* Carbohydrates */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("nutrition.supplements.create.carbohydrates")}
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.carbohydrates"
                    )}
                    value={formData.carbohydrates}
                    onChangeText={(value) =>
                      handleInputChange("carbohydrates", value)
                    }
                    color={FIXED_COLORS.text[50]}
                    keyboardType="numeric"
                  />
                </Input>
              </VStack>

              {/* Calories */}
              <VStack space="xs">
                <Text
                  color={FIXED_COLORS.text[50]}
                  fontSize="$sm"
                  fontWeight="$medium"
                >
                  {t("nutrition.supplements.create.calories")}
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.calories"
                    )}
                    value={formData.calories}
                    onChangeText={(value) =>
                      handleInputChange("calories", value)
                    }
                    color={FIXED_COLORS.text[50]}
                    keyboardType="numeric"
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
                  {t("nutrition.supplements.create.description")}
                </Text>
                <Input
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                  height={100}
                >
                  <InputField
                    placeholder={t(
                      "nutrition.supplements.create.placeholders.description"
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
                  {t("nutrition.supplements.create.reminders")}
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
                      {t("nutrition.supplements.create.addReminder")}
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
                  {t("nutrition.supplements.create.noReminders")}
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
                    {t("nutrition.supplements.create.selectTime")}
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
                    : supplement?.id
                    ? t("nutrition.supplements.create.updateButton")
                    : t("nutrition.supplements.create.createButton")}
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
