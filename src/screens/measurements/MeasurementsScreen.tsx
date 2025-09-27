import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Switch,
  Divider,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer, MeasurementCard, CustomButton } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { userStorage } from "../../services/userStorage";
import { User, Measurements } from "../../types/auth";
import { getMeasurementFields } from "./measurementFields";
import { useUnits } from "../../contexts/UnitsContext";
import { useToast } from "../../hooks/useToast";

export const MeasurementsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
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

      await userStorage.setUserProfile(updatedUser);
      setUser(updatedUser);

      // Aqui futuramente adicionaremos a chamada para a API

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
    <SafeContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        enabled={true}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, position: "relative" }}>
            <Image
              source={getGenderBasedImage()}
              style={{
                position: "absolute",
                top: -280,
                left: -30,
                right: 0,
                bottom: 0,
                width: "120%",
                height: "100%",
                zIndex: 0,
                opacity: 0.4,
              }}
              resizeMode="contain"
            />

            <VStack pb="$4" space="sm">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$xl"
                fontWeight="$bold"
                textAlign="center"
              >
                {t("measurements.title")}
              </Text>
              <Text
                color={FIXED_COLORS.text[300]}
                fontSize="$sm"
                textAlign="center"
                lineHeight="$sm"
                px="$2"
              >
                {t("measurements.description")}
              </Text>
            </VStack>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              <VStack space="md">
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

            <VStack position="absolute" bottom={16} left={0} right={0} p="$0">
              <CustomButton
                text={t("measurements.save")}
                onPress={handleSaveMeasurements}
                isLoading={isSaving}
                isDisabled={isSaving}
              />
            </VStack>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};
