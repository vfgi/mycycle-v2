import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VStack, Text, Image } from "@gluestack-ui/themed";
import { useTranslation } from "../../hooks/useTranslation";
import { FIXED_COLORS } from "../../theme/colors";
import { CustomInput, CustomDrawer, CustomButton } from "../../components";
import { authService } from "../../services/authService";

const dumbellsRed = require("../../../assets/commom-icons/dumbellsred.png");

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "auth.forgotPassword.emailRequired")
    .email("auth.forgotPassword.emailInvalid"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const ForgotPasswordDrawer: React.FC<ForgotPasswordDrawerProps> = ({
  isOpen,
  onClose,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isSending, setIsSending] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSending(true);
      await authService.forgotPassword(data.email);
      setIsSuccess(true);

      // Fechar o drawer após 3 segundos
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error("Send email error:", err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  return (
    <CustomDrawer isOpen={isOpen} onClose={handleClose}>
      <VStack space="md" w="$full" p="$6">
        {isSuccess ? (
          <>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("auth.forgotPassword.emailSentSuccess")}
            </Text>

            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              textAlign="center"
              mb="$4"
            >
              {t("auth.forgotPassword.emailSentMessage")}
            </Text>

            <Image
              source={dumbellsRed}
              alt="Dumbells"
              width={220}
              height={210}
              resizeMode="contain"
              mt="$6"
              alignSelf="center"
            />
          </>
        ) : (
          <>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
              textAlign="center"
            >
              {t("auth.login.forgotPassword")}
            </Text>

            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              textAlign="center"
              mb="$4"
            >
              {t("auth.forgotPassword.instructions")}
            </Text>

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

            <CustomButton
              onPress={handleSubmit(onSubmit)}
              text={t("auth.forgotPassword.sendEmailButton")}
              isLoading={isSending}
            />

            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xs"
              textAlign="center"
              mt="$2"
            >
              {t("auth.forgotPassword.emailSentInfo")}
            </Text>

            <Image
              source={dumbellsRed}
              alt="Dumbells"
              width={220}
              height={210}
              resizeMode="contain"
              mt="$6"
              alignSelf="center"
            />
          </>
        )}
      </VStack>
    </CustomDrawer>
  );
};
