import React, { useState } from "react";
import { Platform } from "react-native";
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
  AlertDialogFooter,
  Button,
  ButtonText,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { notificationService } from "../../services/notificationService";
import { useToast } from "../../hooks/useToast";
import { CustomButton } from "../../components/CustomButton";

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [minutes, setMinutes] = useState("1");

  const handleCreateReminder = async () => {
    if (!title.trim() || !message.trim()) {
      showError("Título e mensagem são obrigatórios");
      return;
    }

    const minutesValue = parseInt(minutes);
    if (isNaN(minutesValue) || minutesValue < 1) {
      showError("Minutos deve ser um número válido maior que 0");
      return;
    }

    try {
      setIsLoading(true);

      // Criar data futura (agora + minutos especificados)
      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + minutesValue);

      const notification = {
        id: "", // Será gerado pelo serviço
        title: title.trim(),
        body: message.trim(),
        scheduledTime,
        isActive: true,
        repeatType: "none" as const,
        category: "test",
        data: { type: "test_reminder" },
      };

      await notificationService.scheduleNotification(notification);

      showSuccess(`Lembrete agendado para ${minutesValue} minuto(s)`);

      // Reset form
      setTitle("");
      setMessage("");
      setMinutes("1");

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error creating reminder:", error);
      showError("Erro ao criar lembrete. Verifique as permissões.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setMessage("");
    setMinutes("1");
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop bg="rgba(0, 0, 0, 0.5)" />
      <AlertDialogContent
        bg={FIXED_COLORS.background[800]}
        borderRadius="$xl"
        borderWidth={1}
        borderColor={FIXED_COLORS.background[600]}
        maxHeight="85%"
        w="90%"
      >
        <AlertDialogHeader>
          <VStack flex={1}>
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              Criar Lembrete de Teste
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              Agende uma notificação local para testar
            </Text>
          </VStack>
          <AlertDialogCloseButton onPress={handleClose}>
            <Ionicons name="close" size={24} color={FIXED_COLORS.text[50]} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>

        <AlertDialogBody>
          <VStack space="lg" p="$2">
            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                Título do Lembrete
              </Text>
              <Input
                bg={FIXED_COLORS.background[700]}
                borderColor={FIXED_COLORS.background[600]}
                borderRadius="$md"
              >
                <InputField
                  placeholder="Ex: Hora do treino!"
                  placeholderTextColor={FIXED_COLORS.text[500]}
                  color={FIXED_COLORS.text[50]}
                  value={title}
                  onChangeText={setTitle}
                />
              </Input>
            </VStack>

            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                Mensagem
              </Text>
              <Input
                bg={FIXED_COLORS.background[700]}
                borderColor={FIXED_COLORS.background[600]}
                borderRadius="$md"
              >
                <InputField
                  placeholder="Ex: Não esqueça de fazer seu treino hoje!"
                  placeholderTextColor={FIXED_COLORS.text[500]}
                  color={FIXED_COLORS.text[50]}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={3}
                />
              </Input>
            </VStack>

            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$md"
                fontWeight="$semibold"
              >
                Notificar em (minutos)
              </Text>
              <Input
                bg={FIXED_COLORS.background[700]}
                borderColor={FIXED_COLORS.background[600]}
                borderRadius="$md"
              >
                <InputField
                  placeholder="Ex: 1"
                  placeholderTextColor={FIXED_COLORS.text[500]}
                  color={FIXED_COLORS.text[50]}
                  value={minutes}
                  onChangeText={setMinutes}
                  keyboardType="numeric"
                />
              </Input>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                A notificação será disparada após este tempo
              </Text>
            </VStack>

            <VStack
              bg={FIXED_COLORS.background[700]}
              borderRadius="$md"
              p="$3"
              space="xs"
            >
              <HStack alignItems="center" space="sm">
                <Ionicons
                  name="information-circle"
                  size={16}
                  color={FIXED_COLORS.primary[600]}
                />
                <Text
                  color={FIXED_COLORS.text[400]}
                  fontSize="$sm"
                  fontWeight="$semibold"
                >
                  Exemplo de Teste
                </Text>
              </HStack>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                Título: "Lembrete de Treino"
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                Mensagem: "Hora de malhar! 💪"
              </Text>
              <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                Tempo: 1 minuto
              </Text>
            </VStack>
          </VStack>
        </AlertDialogBody>

        <AlertDialogFooter>
          <HStack space="md" w="$full">
            <Button
              variant="outline"
              borderColor={FIXED_COLORS.background[600]}
              flex={1}
              onPress={handleClose}
            >
              <ButtonText color={FIXED_COLORS.text[400]}>Cancelar</ButtonText>
            </Button>

            <CustomButton
              onPress={handleCreateReminder}
              text="Criar Lembrete"
              isLoading={isLoading}
            />
          </HStack>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
