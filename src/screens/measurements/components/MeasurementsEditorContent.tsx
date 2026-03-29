import React from "react";
import { ScrollView, Image } from "react-native";
import { VStack, Text, Box } from "@gluestack-ui/themed";
import { MeasurementCard } from "../../../components";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { User } from "../../../types/auth";
import { MeasurementField } from "../measurementFields";

type MeasurementsEditorLayout = "screen" | "modal";

interface MeasurementsEditorContentProps {
  layout: MeasurementsEditorLayout;
  user: User | null;
  measurementFields: MeasurementField[];
  displayValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
  convertHeight: (value: number) => { value: number };
  convertBodyMeasurement: (value: number) => { value: number };
  scrollBottomPadding?: number;
}

const getGenderBasedImageSource = (user: User | null) => {
  if (user?.gender === "female") {
    return require("../../../../assets/images/women/women-measurement.jpg");
  }
  return require("../../../../assets/images/men/measurements-men.jpeg");
};

export const MeasurementsEditorContent: React.FC<
  MeasurementsEditorContentProps
> = ({
  layout,
  user,
  measurementFields,
  displayValues,
  onFieldChange,
  convertHeight,
  convertBodyMeasurement,
  scrollBottomPadding = 24,
}) => {
  const { t } = useTranslation();
  const headerHeight = layout === "screen" ? 200 : 140;

  const headerBlock = (
    <>
      <Image
        source={getGenderBasedImageSource(user)}
        style={{
          width: "100%",
          height: headerHeight,
          opacity: 0.4,
        }}
        resizeMode="cover"
      />
      <VStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={headerHeight}
        alignItems="center"
        justifyContent="center"
        bg="rgba(0, 0, 0, 0.3)"
      >
        <Text
          color={FIXED_COLORS.background[0]}
          fontSize={layout === "screen" ? "$3xl" : "$2xl"}
          fontWeight="$bold"
          textAlign="center"
          px="$3"
        >
          {t("measurements.title")}
        </Text>
        <Text
          color={FIXED_COLORS.background[100]}
          fontSize="$sm"
          textAlign="center"
          lineHeight="$sm"
          px="$4"
          mt="$2"
        >
          {t("measurements.description")}
        </Text>
      </VStack>
    </>
  );

  const fieldsBlock = (
    <VStack px={layout === "screen" ? "$6" : "$3"} pt="$4" space="md">
      {measurementFields.map((field) => {
        const currentValue =
          user?.measurements?.[field.key as keyof typeof user.measurements];
        const displayCurrentValue = currentValue
          ? field.key === "height"
            ? convertHeight(currentValue as number).value.toString()
            : convertBodyMeasurement(currentValue as number).value.toString()
          : undefined;

        return (
          <MeasurementCard
            key={field.key}
            label={field.label}
            description={field.description}
            value={displayValues[field.key] || ""}
            onChangeText={(value) => onFieldChange(field.key, value)}
            unit={field.unit}
            isOptional={field.isOptional}
            currentValue={displayCurrentValue}
            measurementKey={field.key}
          />
        );
      })}
    </VStack>
  );

  if (layout === "screen") {
    return (
      <>
        <Box position="relative" width="100%">
          {headerBlock}
        </Box>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
          keyboardShouldPersistTaps="handled"
        >
          {fieldsBlock}
        </ScrollView>
      </>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, minHeight: 0 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: scrollBottomPadding,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Box
        position="relative"
        width="100%"
        borderRadius="$lg"
        overflow="hidden"
      >
        {headerBlock}
      </Box>
      {fieldsBlock}
    </ScrollView>
  );
};
