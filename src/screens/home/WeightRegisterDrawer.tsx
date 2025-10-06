import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VStack, HStack, Text, ScrollView } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTranslation } from "../../hooks/useTranslation";
import { useUnits } from "../../contexts/UnitsContext";
import { FIXED_COLORS } from "../../theme/colors";
import { CustomInput, CustomDrawer, CustomButton } from "../../components";
import { useToast } from "../../hooks/useToast";

const weightSchema = z.object({
  weight: z
    .string()
    .min(1, "weight.weightRequired")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "weight.weightInvalid",
    }),
});

type WeightFormData = z.infer<typeof weightSchema>;

type FilterType = "weekly" | "monthly" | "semestral" | "annual";

interface WeightData {
  value: number;
  label: string;
  date: string;
}

const mockWeeklyData: WeightData[] = [
  { value: 100.5, label: "Seg", date: "2024-01-15" },
  { value: 99.8, label: "Ter", date: "2024-01-16" },
  { value: 99.5, label: "Qua", date: "2024-01-17" },
  { value: 99.2, label: "Qui", date: "2024-01-18" },
  { value: 99.0, label: "Sex", date: "2024-01-19" },
  { value: 98.8, label: "Sáb", date: "2024-01-20" },
  { value: 98.5, label: "Dom", date: "2024-01-21" },
];

const mockMonthlyData: WeightData[] = [
  { value: 102.0, label: "Sem 1", date: "2024-01-07" },
  { value: 101.2, label: "Sem 2", date: "2024-01-14" },
  { value: 99.8, label: "Sem 3", date: "2024-01-21" },
  { value: 98.5, label: "Sem 4", date: "2024-01-28" },
];

const mockSemestralData: WeightData[] = [
  { value: 105.0, label: "Ago", date: "2023-08-01" },
  { value: 103.5, label: "Set", date: "2023-09-01" },
  { value: 102.0, label: "Out", date: "2023-10-01" },
  { value: 101.0, label: "Nov", date: "2023-11-01" },
  { value: 100.0, label: "Dez", date: "2023-12-01" },
  { value: 98.5, label: "Jan", date: "2024-01-01" },
];

const mockAnnualData: WeightData[] = [
  { value: 110.0, label: "Fev", date: "2023-02-01" },
  { value: 108.5, label: "Mar", date: "2023-03-01" },
  { value: 107.0, label: "Abr", date: "2023-04-01" },
  { value: 106.0, label: "Mai", date: "2023-05-01" },
  { value: 105.0, label: "Jun", date: "2023-06-01" },
  { value: 104.0, label: "Jul", date: "2023-07-01" },
  { value: 103.0, label: "Ago", date: "2023-08-01" },
  { value: 102.0, label: "Set", date: "2023-09-01" },
  { value: 101.0, label: "Out", date: "2023-10-01" },
  { value: 100.0, label: "Nov", date: "2023-11-01" },
  { value: 99.0, label: "Dez", date: "2023-12-01" },
  { value: 98.5, label: "Jan", date: "2024-01-01" },
];

interface WeightRegisterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const filters: FilterType[] = ["weekly", "monthly", "semestral", "annual"];

export const WeightRegisterDrawer: React.FC<WeightRegisterDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const { convertWeight, unitSystem } = useUnits();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("weekly");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      weight: "",
    },
  });

  const getDataByFilter = (): WeightData[] => {
    switch (selectedFilter) {
      case "weekly":
        return mockWeeklyData;
      case "monthly":
        return mockMonthlyData;
      case "semestral":
        return mockSemestralData;
      case "annual":
        return mockAnnualData;
      default:
        return mockWeeklyData;
    }
  };

  const onSubmit = async (data: WeightFormData) => {
    try {
      setIsSaving(true);

      const weightInDisplayUnit = parseFloat(data.weight);
      let weightInKg = weightInDisplayUnit;

      if (unitSystem === "imperial") {
        weightInKg = weightInDisplayUnit / 2.205;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess(t("weight.weightSaved"));

      reset();
    } catch (err) {
      console.error("Save weight error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const rawChartData = getDataByFilter();
  const chartData = rawChartData.map((item) => ({
    ...item,
    value: convertWeight(item.value).value,
  }));
  const maxValue = Math.max(...chartData.map((d) => d.value));
  const minValue = Math.min(...chartData.map((d) => d.value));

  const FilterButton: React.FC<{
    filter: FilterType;
    label: string;
  }> = ({ filter, label }) => (
    <TouchableOpacity
      onPress={() => setSelectedFilter(filter)}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor:
          selectedFilter === filter
            ? FIXED_COLORS.primary[600]
            : FIXED_COLORS.background[700],
      }}
    >
      <Text
        color={
          selectedFilter === filter
            ? FIXED_COLORS.background[950]
            : FIXED_COLORS.text[400]
        }
        fontSize="$sm"
        fontWeight={selectedFilter === filter ? "$bold" : "$normal"}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const weightPlaceholder =
    unitSystem === "imperial" ? "Ex: 165.5" : "Ex: 75.5";

  return (
    <CustomDrawer isOpen={isOpen} onClose={handleClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="xs" w="$full" p="$4">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$xl"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("weight.registerWeight")}
          </Text>

          <HStack space="md" alignItems="flex-start">
            <VStack flex={1}>
              <Controller
                control={control}
                name="weight"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label={`${t("weight.enterWeight")} (${weightUnit})`}
                    placeholder={weightPlaceholder}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={
                      errors.weight ? t(errors.weight.message || "") : undefined
                    }
                    isInvalid={!!errors.weight}
                    keyboardType="numeric"
                  />
                )}
              />
            </VStack>

            <VStack pt="$0">
              <CustomButton
                onPress={handleSubmit(onSubmit)}
                text={t("weight.saveWeight")}
                isLoading={isSaving}
                mt="$5"
                height={50}
              />
            </VStack>
          </HStack>

          <VStack space="md" mt="$4">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {t("weight.weightHistory")}
            </Text>

            <HStack space="sm" flexWrap="wrap">
              {filters.map((filter) => (
                <FilterButton
                  key={filter}
                  filter={filter}
                  label={t(`weight.filters.${filter}`)}
                />
              ))}
            </HStack>

            <VStack
              bg={FIXED_COLORS.background[700]}
              borderRadius="$lg"
              p="$4"
              mt="$2"
            >
              <LineChart
                data={chartData}
                width={280}
                height={200}
                spacing={selectedFilter === "annual" ? 20 : 40}
                initialSpacing={10}
                color={FIXED_COLORS.primary[600]}
                thickness={3}
                startFillColor={FIXED_COLORS.primary[600]}
                endFillColor={FIXED_COLORS.background[700]}
                startOpacity={0.4}
                endOpacity={0.1}
                hideDataPoints={selectedFilter === "annual"}
                dataPointsColor={FIXED_COLORS.primary[600]}
                dataPointsRadius={4}
                textColor={FIXED_COLORS.text[400]}
                textFontSize={12}
                yAxisColor={FIXED_COLORS.background[600]}
                xAxisColor={FIXED_COLORS.background[600]}
                yAxisTextStyle={{ color: FIXED_COLORS.text[400] }}
                curved
                areaChart
                hideRules
                maxValue={maxValue + 2}
                yAxisOffset={minValue - 2}
                noOfSections={4}
              />
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
