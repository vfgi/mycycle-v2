import React from "react";
import { Linking } from "react-native";
import { VStack, Text, HStack, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { useToast } from "../hooks/useToast";
import { CustomDrawer } from "./CustomDrawer";
import { CustomButton } from "./CustomButton";

interface HelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();

  const handleSendEmail = async () => {
    try {
      const subject = encodeURIComponent(t("help.emailSubject"));
      const body = encodeURIComponent(t("help.emailBody"));
      const email = t("help.supportEmail");

      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

      const canOpen = await Linking.canOpenURL(mailtoUrl);

      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        showSuccess(t("help.emailSent"));
        onClose();
      } else {
        // Fallback - copy email to clipboard or show alternative
        showError(
          "Não foi possível abrir o cliente de e-mail. Entre em contato através do e-mail: " +
            email
        );
      }
    } catch (error) {
      console.error("Error opening email client:", error);
      showError("Erro ao abrir o cliente de e-mail");
    }
  };

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose}>
      <VStack space="lg" p="$4">
        {/* Header */}
        <VStack space="sm" alignItems="center">
          <HStack alignItems="center" space="md">
            <Ionicons
              name="help-circle"
              size={32}
              color={FIXED_COLORS.primary[600]}
            />
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              {t("help.title")}
            </Text>
          </HStack>
        </VStack>

        {/* Support Section */}
        <VStack space="md">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$lg"
            fontWeight="$semibold"
            textAlign="center"
          >
            {t("help.contactSupport")}
          </Text>

          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$md"
            textAlign="center"
            lineHeight="$lg"
          >
            {t("help.supportDescription")}
          </Text>

          {/* Support Email Display */}
          <VStack
            bg={FIXED_COLORS.background[700]}
            borderRadius="$md"
            p="$4"
            space="sm"
            alignItems="center"
          >
            <HStack alignItems="center" space="sm">
              <Ionicons
                name="mail"
                size={20}
                color={FIXED_COLORS.primary[600]}
              />
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                E-mail de Suporte:
              </Text>
            </HStack>

            <Pressable
              onPress={() =>
                Linking.openURL(`mailto:${t("help.supportEmail")}`)
              }
              p="$2"
              borderRadius="$sm"
              $pressed={{
                bg: FIXED_COLORS.background[600],
              }}
            >
              <Text
                color={FIXED_COLORS.primary[600]}
                fontSize="$md"
                fontWeight="$medium"
                textDecorationLine="underline"
              >
                {t("help.supportEmail")}
              </Text>
            </Pressable>
          </VStack>

          {/* Send Email Button */}
          <VStack space="sm" mt="$4">
            <CustomButton
              onPress={handleSendEmail}
              text={t("help.sendEmail")}
              isLoading={false}
            />

            <Text
              color={FIXED_COLORS.text[500]}
              fontSize="$sm"
              textAlign="center"
              lineHeight="$md"
            >
              Será aberto seu cliente de e-mail padrão com o assunto e uma
              mensagem pré-preenchida.
            </Text>
          </VStack>
        </VStack>

        {/* Help Icon */}
        <VStack alignItems="center" mt="$4">
          <Ionicons
            name="headset"
            size={48}
            color={FIXED_COLORS.primary[600]}
            style={{ opacity: 0.7 }}
          />
        </VStack>
      </VStack>
    </CustomDrawer>
  );
};
