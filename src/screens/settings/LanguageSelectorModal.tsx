import React from "react";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { changeLanguage } from "../../i18n";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  {
    code: "pt-BR",
    name: "Português (Brasil)",
    flag: "🇧🇷",
  },
  {
    code: "pt-PT",
    name: "Português (Portugal)",
    flag: "🇵🇹",
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
  },
];

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      onClose();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop bg="rgba(0, 0, 0, 1)" />
      <AlertDialogContent
        bg={FIXED_COLORS.background[800]}
        borderRadius="$xl"
        borderWidth={1}
        borderColor={FIXED_COLORS.background[600]}
      >
        <AlertDialogHeader>
          <Text color={FIXED_COLORS.text[50]} fontSize="$lg" fontWeight="$bold">
            {t("settings.selectLanguage")}
          </Text>
          <AlertDialogCloseButton>
            <Ionicons name="close" size={24} color={FIXED_COLORS.text[50]} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>

        <AlertDialogBody>
          <VStack space="sm">
            {languages.map((language) => (
              <Pressable
                key={language.code}
                onPress={() => handleLanguageSelect(language.code)}
                p="$3"
                borderRadius="$md"
                $pressed={{
                  bg: FIXED_COLORS.background[700],
                }}
              >
                <HStack alignItems="center" space="md">
                  <Text fontSize="$2xl">{language.flag}</Text>
                  <Text color={FIXED_COLORS.text[50]} fontSize="$md" flex={1}>
                    {language.name}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};
