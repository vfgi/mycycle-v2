import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import {
  VStack,
  HStack,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeContainer, FloatingTextInput } from "../../../../components";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useToast } from "../../../../hooks/useToast";
import { SupplementFormData } from "./types";

export const CreateSupplementScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<SupplementFormData>({
    name: "",
    description: "",
    brand: "",
    category: "protein",
    dosage: "",
    frequency: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    field: keyof SupplementFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validação básica
      if (!formData.name.trim()) {
        showToast(t("nutrition.supplements.errors.nameRequired"), "error");
        return;
      }

      if (!formData.dosage.trim()) {
        showToast(t("nutrition.supplements.errors.dosageRequired"), "error");
        return;
      }

      if (!formData.frequency.trim()) {
        showToast(t("nutrition.supplements.errors.frequencyRequired"), "error");
        return;
      }

      // TODO: Implementar chamada para API
      console.log("Creating supplement:", formData);

      showToast(t("nutrition.supplements.success.created"), "success");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating supplement:", error);
      showToast(t("nutrition.supplements.errors.createError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = [
    { value: "protein", label: t("nutrition.supplements.categories.protein") },
    { value: "vitamin", label: t("nutrition.supplements.categories.vitamin") },
    { value: "mineral", label: t("nutrition.supplements.categories.mineral") },
    {
      value: "preworkout",
      label: t("nutrition.supplements.categories.preworkout"),
    },
    { value: "other", label: t("nutrition.supplements.categories.other") },
  ];

  return (
    <SafeContainer>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <VStack space="lg" p="$4">
          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$xl"
              fontWeight="$bold"
            >
              {t("nutrition.supplements.create.title")}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              {t("nutrition.supplements.create.description")}
            </Text>
          </VStack>

          <VStack space="md">
            {/* Nome do suplemento */}
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
                    "nutrition.supplements.create.namePlaceholder"
                  )}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  color={FIXED_COLORS.text[50]}
                />
              </Input>
            </VStack>

            {/* Marca */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {t("nutrition.supplements.create.brand")}
              </Text>
              <Input
                bg={FIXED_COLORS.background[800]}
                borderColor={FIXED_COLORS.background[600]}
                borderRadius="$md"
              >
                <InputField
                  placeholder={t(
                    "nutrition.supplements.create.brandPlaceholder"
                  )}
                  value={formData.brand}
                  onChangeText={(value) => handleInputChange("brand", value)}
                  color={FIXED_COLORS.text[50]}
                />
              </Input>
            </VStack>

            {/* Categoria */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {t("nutrition.supplements.create.category")} *
              </Text>
              <Select
                selectedValue={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  bg={FIXED_COLORS.background[800]}
                  borderColor={FIXED_COLORS.background[600]}
                  borderRadius="$md"
                >
                  <SelectInput
                    placeholder={t(
                      "nutrition.supplements.create.categoryPlaceholder"
                    )}
                    color={FIXED_COLORS.text[50]}
                  />
                  <SelectIcon>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={FIXED_COLORS.text[400]}
                    />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {categoryOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            {/* Dosagem */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {t("nutrition.supplements.create.dosage")} *
              </Text>
              <Input
                bg={FIXED_COLORS.background[800]}
                borderColor={FIXED_COLORS.background[600]}
                borderRadius="$md"
              >
                <InputField
                  placeholder={t(
                    "nutrition.supplements.create.dosagePlaceholder"
                  )}
                  value={formData.dosage}
                  onChangeText={(value) => handleInputChange("dosage", value)}
                  color={FIXED_COLORS.text[50]}
                />
              </Input>
            </VStack>

            {/* Frequência */}
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
                    "nutrition.supplements.create.frequencyPlaceholder"
                  )}
                  value={formData.frequency}
                  onChangeText={(value) =>
                    handleInputChange("frequency", value)
                  }
                  color={FIXED_COLORS.text[50]}
                />
              </Input>
            </VStack>

            {/* Descrição */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$medium"
              >
                {t("nutrition.supplements.create.description")}
              </Text>
              <FloatingTextInput
                placeholder={t(
                  "nutrition.supplements.create.descriptionPlaceholder"
                )}
                value={formData.description}
                onChangeText={(value) =>
                  handleInputChange("description", value)
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </VStack>
          </VStack>

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
    </SafeContainer>
  );
};
