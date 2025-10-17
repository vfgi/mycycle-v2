import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { FloatingTextInput } from "../../../components";
import { MealFormData } from "../../../schemas/mealSchema";
import { MealTypeSelector } from "./MealTypeSelector";

interface MealBasicInfoFormProps {
  control: Control<MealFormData>;
  errors: FieldErrors<MealFormData>;
  selectedMealType?: string;
  onSelectMealType: (type: string) => void;
}

export const MealBasicInfoForm: React.FC<MealBasicInfoFormProps> = ({
  control,
  errors,
  selectedMealType,
  onSelectMealType,
}) => {
  const { t } = useTranslation();

  return (
    <VStack space="md">
      <Text color={FIXED_COLORS.text[50]} fontSize="$lg" fontWeight="$semibold">
        {t("nutrition.meals.basicInfo")}
      </Text>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <FloatingTextInput
            label={t("nutrition.meals.mealName")}
            value={value}
            onChangeText={onChange}
            backgroundColor={FIXED_COLORS.background[800]}
            valueColor={FIXED_COLORS.text[50]}
            isFocusLabelColor={FIXED_COLORS.primary[400]}
            isBlurLabelColor={
              errors.name ? FIXED_COLORS.error[400] : FIXED_COLORS.text[400]
            }
            isFocusBorderColor={FIXED_COLORS.primary[500]}
            isBlurBorderColor={
              errors.name
                ? FIXED_COLORS.error[500]
                : FIXED_COLORS.background[600]
            }
            isBlurValueBorderColor={FIXED_COLORS.background[600]}
          />
        )}
      />
      {errors.name && (
        <Text color={FIXED_COLORS.error[500]} fontSize="$xs">
          {errors.name.message}
        </Text>
      )}

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <FloatingTextInput
            label={t("nutrition.meals.description")}
            value={value}
            onChangeText={onChange}
            backgroundColor={FIXED_COLORS.background[800]}
            valueColor={FIXED_COLORS.text[50]}
            isFocusLabelColor={FIXED_COLORS.primary[400]}
            isBlurLabelColor={FIXED_COLORS.text[400]}
            isFocusBorderColor={FIXED_COLORS.primary[500]}
            isBlurBorderColor={FIXED_COLORS.background[600]}
            isBlurValueBorderColor={FIXED_COLORS.background[600]}
          />
        )}
      />

      {/* Meal Type Selection */}
      <MealTypeSelector
        selectedType={selectedMealType}
        onSelectType={onSelectMealType}
        error={errors.meal_type?.message}
      />
    </VStack>
  );
};
