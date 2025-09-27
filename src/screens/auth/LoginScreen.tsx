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
import { loginSchema, LoginFormData } from "../../schemas/authSchema";
import { useTranslation } from "../../hooks/useTranslation";
import { FIXED_COLORS } from "../../theme/colors";
import { AuthContainer, CustomInput, CustomButton } from "../../components";
import { ForgotPasswordDrawer } from "./ForgotPasswordDrawer";
import { Image } from "@gluestack-ui/themed";

const loginBackground = require("../../../assets/images/login-background.png");
const logoStandard = require("../../../assets/logo-standard.png");

interface LoginScreenProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  onNavigateToSignup: () => void;
  isLoading?: boolean;
  error?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToSignup,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await onLogin(data);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <AuthContainer backgroundImage={loginBackground}>
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
                  {t("auth.login.loginError")}
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
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={t("auth.login.email")}
                    placeholder={t("auth.login.emailPlaceholder")}
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
                    label={t("auth.login.password")}
                    placeholder={t("auth.login.passwordPlaceholder")}
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

              <CustomButton
                onPress={handleSubmit(onSubmit)}
                text={t("auth.login.loginButton")}
                isLoading={isLoading}
              />

              <HStack space="sm" justifyContent="center" mt="$2">
                <Text color={FIXED_COLORS.text[300]}>
                  {t("auth.common.dontHaveAccount")}
                </Text>
                <Text
                  color={FIXED_COLORS.primary[600]}
                  textDecorationLine="underline"
                  onPress={onNavigateToSignup}
                >
                  {t("auth.common.signup")}
                </Text>
              </HStack>
              <HStack space="sm" justifyContent="center" mt="$4">
                <Text
                  color={FIXED_COLORS.primary[600]}
                  textDecorationLine="underline"
                  onPress={() => setIsForgotPasswordOpen(true)}
                >
                  {t("auth.login.forgotPassword")}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ForgotPasswordDrawer
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        isLoading={isLoading}
      />
    </AuthContainer>
  );
};
