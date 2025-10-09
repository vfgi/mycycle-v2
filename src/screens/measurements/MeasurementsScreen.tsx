import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { VStack, Text } from "@gluestack-ui/themed";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer, MeasurementCard, CustomButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { userStorage } from "../../services/userStorage";
import { userService } from "../../services/userService";
import { User, Measurements } from "../../types/auth";
import { getMeasurementFields } from "./measurementFields";
import { useUnits } from "../../contexts/UnitsContext";
import { useToast } from "../../hooks/useToast";

export const MeasurementsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const {
    convertBodyMeasurement,
    convertHeight,
    convertInputToMetric,
    getUnitForMeasurement,
  } = useUnits();
  const [user, setUser] = useState<User | null>(null);
  const [measurements, setMeasurements] = useState<Measurements>({});
  const [displayValues, setDisplayValues] = useState<Record<string, string>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await userStorage.getUserProfile();
        setUser(userData);
        if (userData?.measurements) {
          setMeasurements(userData.measurements);

          // Convert stored metric values to display values based on user's unit preference
          const displayVals: Record<string, string> = {};
          Object.entries(userData.measurements).forEach(([key, value]) => {
            if (value) {
              if (key === "height") {
                const converted = convertHeight(value);
                displayVals[key] = converted.value.toString();
              } else {
                const converted = convertBodyMeasurement(value);
                displayVals[key] = converted.value.toString();
              }
            }
          });
          setDisplayValues(displayVals);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [convertHeight, convertBodyMeasurement]);

  const measurementFields = useMemo(() => {
    return getMeasurementFields(t, user, getUnitForMeasurement);
  }, [t, user?.gender, getUnitForMeasurement]);

  const handleMeasurementChange = (key: string, value: string) => {
    // Update display value (what user sees)
    setDisplayValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Convert to metric for storage
    if (value) {
      const measurementType = key === "height" ? "height" : "body";
      const metricValue = convertInputToMetric(value, measurementType);
      setMeasurements((prev) => ({
        ...prev,
        [key]: metricValue,
      }));
    } else {
      setMeasurements((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  };

  const handleSaveMeasurements = async () => {
    try {
      if (!user) return;

      setIsSaving(true);

      const updatedUser = {
        ...user,
        measurements,
      };

      // Primeiro tenta salvar na API
      await userService.updateProfile({
        measurements,
      });

      // Se API teve sucesso, então salva localmente
      await userStorage.setUserProfile(updatedUser);
      setUser(updatedUser);

      showSuccess(t("measurements.updated"));
    } catch (error) {
      console.error("Error saving measurements:", error);
      showError(t("measurements.updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  const getGenderBasedImage = () => {
    if (user?.gender === "female") {
      return require("../../../assets/images/women/women-measurement.jpg");
    }
    return require("../../../assets/images/men/measurements-men.jpeg");
  };

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <VStack flex={1}>
          <Image
            source={getGenderBasedImage()}
            style={{
              width: "100%",
              height: 200,
              opacity: 0.4,
            }}
            resizeMode="cover"
          />

          <VStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            height={200}
            alignItems="center"
            justifyContent="center"
            bg="rgba(0, 0, 0, 0.3)"
          >
            <Text
              color={FIXED_COLORS.background[0]}
              fontSize="$3xl"
              fontWeight="$bold"
              textAlign="center"
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

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
          >
            <VStack px="$6" pt="$6" space="md">
              {measurementFields.map((field) => (
                <MeasurementCard
                  key={field.key}
                  label={field.label}
                  description={field.description}
                  value={displayValues[field.key] || ""}
                  onChangeText={(value) =>
                    handleMeasurementChange(field.key, value)
                  }
                  unit={field.unit}
                  isOptional={field.isOptional}
                />
              ))}
            </VStack>
          </ScrollView>

          <VStack
            bg={FIXED_COLORS.background[800]}
            p="$4"
            mb="$6"
            borderTopWidth={1}
            borderTopColor={FIXED_COLORS.background[700]}
          >
            <CustomButton
              text={t("measurements.save")}
              onPress={handleSaveMeasurements}
              isLoading={isSaving}
              mt="$0"
            />
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};
