import React, { useState } from "react";
import {
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VStack, Text, HStack, Pressable, Image } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { CustomInput } from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import { authService } from "../../services/authService";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "../../hooks/useToast";
import { SafeContainer } from "../../components";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const dumbellsIron = require("../../../assets/commom-icons/dumbells-iron.png");

export const ChangePasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });

      showSuccess(t("settings.passwordChangedSuccess"));
      reset();
      navigation.goBack();
    } catch (error) {
      console.error("Error changing password:", error);
      showError(t("settings.passwordChangedMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeContainer>
      <ScrollView style={{ flex: 1 }}>
        <VStack flex={1} p="$0" space="lg">
          {/* Header */}
          <HStack alignItems="center" justifyContent="space-between" mb="$4">
            <Pressable onPress={handleGoBack}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={FIXED_COLORS.text[50]}
              />
            </Pressable>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              {t("settings.changePassword")}
            </Text>
            <VStack w="$6" />
          </HStack>

          {/* Content */}
          <VStack
            bg={FIXED_COLORS.background[800]}
            borderRadius="$lg"
            p="$6"
            space="lg"
          >
            <Image
              source={dumbellsIron}
              alt="Dumbells"
              width={160}
              height={160}
              resizeMode="contain"
              alignSelf="center"
              mt="$4"
            />
            <VStack space="sm" alignItems="center">
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                textAlign="center"
              >
                {t("settings.changePasswordInstructions")}
              </Text>
            </VStack>

            <VStack space="md">
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("settings.currentPassword")}
                    placeholder={t("settings.currentPasswordPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    error={errors.currentPassword?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("settings.newPassword")}
                    placeholder={t("settings.newPasswordPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    error={errors.newPassword?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("settings.confirmNewPassword")}
                    placeholder={t("settings.confirmNewPasswordPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoCapitalize="none"
                    error={errors.confirmPassword?.message}
                  />
                )}
              />
            </VStack>

            <VStack space="sm">
              <CustomButton
                onPress={handleSubmit(handleChangePassword)}
                text={t("settings.changePasswordButton")}
                isLoading={isLoading}
                isDisabled={!isValid}
              />

              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$xs"
                textAlign="center"
              >
                {t("settings.passwordRequirements")}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
