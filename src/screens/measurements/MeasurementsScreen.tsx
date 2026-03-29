import React, { useCallback } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { SafeContainer, CustomButton } from "../../components";
import { useTranslation } from "../../hooks/useTranslation";
import { useFocusEffect } from "@react-navigation/native";
import { FIXED_COLORS } from "../../theme/colors";
import { useMeasurementsEditor } from "./hooks/useMeasurementsEditor";
import { MeasurementsEditorContent } from "./components/MeasurementsEditorContent";
import { useUnits } from "../../contexts/UnitsContext";

export const MeasurementsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { convertHeight, convertBodyMeasurement } = useUnits();
  const {
    user,
    measurementFields,
    displayValues,
    handleMeasurementChange,
    saveMeasurements,
    isSaving,
    loadUserData,
  } = useMeasurementsEditor();

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData]),
  );

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <VStack flex={1}>
          <MeasurementsEditorContent
            layout="screen"
            user={user}
            measurementFields={measurementFields}
            displayValues={displayValues}
            onFieldChange={handleMeasurementChange}
            convertHeight={convertHeight}
            convertBodyMeasurement={convertBodyMeasurement}
            scrollBottomPadding={120}
          />

          <VStack
            bg={FIXED_COLORS.background[800]}
            p="$4"
            mb="$6"
            borderTopWidth={1}
            borderTopColor={FIXED_COLORS.background[700]}
          >
            <CustomButton
              text={t("measurements.save")}
              onPress={() => {
                void saveMeasurements();
              }}
              isLoading={isSaving}
              mt="$0"
            />
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};
