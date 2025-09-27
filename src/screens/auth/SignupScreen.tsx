import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { VStack, HStack, Text, Alert, AlertText } from "@gluestack-ui/themed";
import { signupSchema, SignupFormData } from "../../schemas/signupSchema";
import { useTranslation } from "../../hooks/useTranslation";
import { FIXED_COLORS } from "../../theme/colors";
import { SignupContainer, CustomInput, CustomButton } from "../../components";
import { Image } from "@gluestack-ui/themed";

const loginBackground = require("../../../assets/images/signup-image.png");
const logoStandard = require("../../../assets/logo-standard.png");

interface SignupScreenProps {
  onSignup: (data: SignupFormData) => Promise<void>;
  onNavigateToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignup,
  onNavigateToLogin,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await onSignup(data);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <SignupContainer backgroundImage={loginBackground}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack alignItems="center" justifyContent="center" flex={1}>
            <Image
              source={logoStandard}
              alt="Logo"
              width={260}
              height={120}
              resizeMode="contain"
            />

            {error && (
              <Alert action="error" variant="outline">
                <AlertText color={FIXED_COLORS.error[600]}>
                  {t("auth.signup.signupError")}
                </AlertText>
              </Alert>
            )}

            <VStack
              space="md"
              w="$full"
              p="$6"
              borderRadius="$xl"
              shadowColor="$black"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={5}
            >
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("auth.signup.name")}
                    placeholder={t("auth.signup.namePlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors.name ? t(errors.name.message || "") : undefined
                    }
                    isInvalid={!!errors.name}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("auth.signup.email")}
                    placeholder={t("auth.signup.emailPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors.email ? t(errors.email.message || "") : undefined
                    }
                    isInvalid={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("auth.signup.password")}
                    placeholder={t("auth.signup.passwordPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors.password
                        ? t(errors.password.message || "")
                        : undefined
                    }
                    isInvalid={!!errors.password}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("auth.signup.confirmPassword")}
                    placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors.confirmPassword
                        ? t(errors.confirmPassword.message || "")
                        : undefined
                    }
                    isInvalid={!!errors.confirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <CustomButton
                onPress={handleSubmit(onSubmit)}
                text={t("auth.signup.signupButton")}
                isLoading={isLoading}
              />

              <HStack space="sm" justifyContent="center" mt="$4">
                <Text color={FIXED_COLORS.text[600]}>
                  {t("auth.common.alreadyHaveAccount")}
                </Text>
                <Text
                  color={FIXED_COLORS.primary[600]}
                  textDecorationLine="underline"
                  onPress={onNavigateToLogin}
                >
                  {t("auth.common.signin")}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SignupContainer>
  );
};
