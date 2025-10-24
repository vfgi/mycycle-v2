import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VStack, HStack, Text, ScrollView, Box } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { useUnits } from "../../contexts/UnitsContext";
import { FIXED_COLORS } from "../../theme/colors";
import { CustomInput, CustomDrawer, CustomButton } from "../../components";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../contexts/AuthContext";
import { userService, WeightHistoryData } from "../../services/userService";

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
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("annual");
  const { user } = useAuth();
  const [weightHistory, setWeightHistory] = useState<WeightHistoryData[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  React.useEffect(() => {
    if (isOpen && user?.id) {
      loadWeightHistory();
    }
  }, [isOpen, user?.id]);

  React.useEffect(() => {
    if (isOpen && user?.id) {
      loadWeightHistory();
    }
  }, [selectedFilter]);

  const mapFilterToPeriod = (
    filter: FilterType
  ): "weekly" | "monthly" | "yearly" => {
    switch (filter) {
      case "weekly":
        return "weekly";
      case "monthly":
        return "monthly";
      case "semestral":
      case "annual":
        return "yearly";
      default:
        return "yearly";
    }
  };

  const loadWeightHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const period = mapFilterToPeriod(selectedFilter);
      const data = await userService.getWeightHistory(user?.id || "", period);
      setWeightHistory(data.data);
    } catch (error) {
      console.error("Error loading weight history:", error);
      setWeightHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

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

  const onSubmit = async (data: WeightFormData) => {
    try {
      setIsSaving(true);

      // Converter vírgula para ponto (formato brasileiro)
      const weightString = data.weight.replace(",", ".");
      const weightInDisplayUnit = parseFloat(weightString);
      let weightInKg = weightInDisplayUnit;

      if (unitSystem === "imperial") {
        weightInKg = weightInDisplayUnit / 2.205;
      }

      console.log("📤 Saving weight:", {
        clientId: user?.id,
        weightInDisplayUnit,
        weightInKg,
        payload: {
          measurements: {
            weight: weightInKg,
          },
        },
      });

      await userService.updateUserMeasurement(user?.id || "", weightInKg);

      showSuccess(t("weight.weightSaved"));

      reset();
      loadWeightHistory();
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

  const rawChartData = weightHistory;

  // Mapear dados: apenas adicionar value quando tiver peso
  const chartData = rawChartData.map((item) => ({
    ...item,
    value: item.weight !== undefined ? convertWeight(item.weight).value : 0,
  }));

  console.log("📊 Chart Data Debug:", {
    rawChartData: rawChartData.map((d) => d.label),
    chartData,
    chartDataLength: chartData.length,
  });

  const chartDataWithValues = chartData.filter((item) => item.value > 0);
  const maxValue =
    chartDataWithValues.length > 0
      ? Math.max(...chartDataWithValues.map((d) => d.value)) + 2
      : 100;
  const minValue =
    chartDataWithValues.length > 0
      ? Math.min(...chartDataWithValues.map((d) => d.value)) - 2
      : 50;

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
              <HStack
                justifyContent="space-between"
                alignItems="flex-end"
                height={150}
                px="$1"
              >
                {chartData.map((dayData, index) => {
                  const value = dayData.value;
                  const barHeight = maxValue > 0 ? (value / maxValue) * 120 : 0;
                  const barColor =
                    value > 0
                      ? FIXED_COLORS.primary[500]
                      : FIXED_COLORS.background[600];

                  return (
                    <VStack key={index} alignItems="center" space="xs" flex={1}>
                      <Text
                        color={FIXED_COLORS.text[50]}
                        fontSize={selectedFilter === "annual" ? "$2xs" : "$xs"}
                        fontWeight="$medium"
                      >
                        {value > 0 ? value.toFixed(1) : "-"}
                      </Text>

                      <Box
                        bg={barColor}
                        width="$6"
                        height={barHeight}
                        borderRadius="$sm"
                        borderTopLeftRadius="$md"
                        borderTopRightRadius="$md"
                        opacity={0.9}
                      />

                      <Text
                        color="rgba(255, 255, 255, 0.9)"
                        fontSize="$xs"
                        fontWeight="$semibold"
                      >
                        {dayData.label}
                      </Text>
                    </VStack>
                  );
                })}
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
