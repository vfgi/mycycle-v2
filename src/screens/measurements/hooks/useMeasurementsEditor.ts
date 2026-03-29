import { useState, useCallback, useMemo, useRef } from "react";
import { userService } from "../../../services/userService";
import { userStorage } from "../../../services/userStorage";
import { User, Measurements } from "../../../types/auth";
import { getMeasurementFields } from "../measurementFields";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../contexts/AuthContext";

export function useMeasurementsEditor() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const { updateUser } = useAuth();
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

  const updateUserRef = useRef(updateUser);
  const convertHeightRef = useRef(convertHeight);
  const convertBodyMeasurementRef = useRef(convertBodyMeasurement);
  updateUserRef.current = updateUser;
  convertHeightRef.current = convertHeight;
  convertBodyMeasurementRef.current = convertBodyMeasurement;

  const loadUserData = useCallback(async () => {
    try {
      const profileFromApi = await userService.getProfile();
      if (!profileFromApi) return;

      setUser(profileFromApi);
      updateUserRef.current(profileFromApi);

      const meas = profileFromApi.measurements;
      if (meas && Object.keys(meas).length > 0) {
        setMeasurements(meas);
        const displayVals: Record<string, string> = {};
        Object.entries(meas).forEach(([key, value]) => {
          if (value != null && value !== "") {
            if (key === "height") {
              const converted = convertHeightRef.current(value as number);
              displayVals[key] = converted.value.toString();
            } else {
              const converted = convertBodyMeasurementRef.current(
                value as number
              );
              displayVals[key] = converted.value.toString();
            }
          }
        });
        setDisplayValues(displayVals);
      } else {
        setMeasurements({});
        setDisplayValues({});
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const measurementFields = useMemo(
    () => getMeasurementFields(t, user, getUnitForMeasurement),
    [t, user?.gender, getUnitForMeasurement, user]
  );

  const handleMeasurementChange = useCallback(
    (key: string, value: string) => {
      setDisplayValues((prev) => ({
        ...prev,
        [key]: value,
      }));

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
    },
    [convertInputToMetric]
  );

  const saveMeasurements = useCallback(async (): Promise<boolean> => {
    try {
      if (!user?.id) return false;

      setIsSaving(true);

      await userService.updateMeasurements(
        user.id,
        measurements as Record<string, number | undefined>
      );

      const userWithMeasurements = {
        ...user,
        measurements: {
          ...user.measurements,
          ...Object.fromEntries(
            Object.entries(measurements).filter(
              (entry): entry is [string, number] =>
                entry[1] != null && typeof entry[1] === "number"
            )
          ),
        },
      };

      setUser(userWithMeasurements);
      updateUser(userWithMeasurements);
      await userStorage.setUserProfile(userWithMeasurements);

      showSuccess(t("measurements.updated"));
      return true;
    } catch (error) {
      console.error("Error saving measurements:", error);
      showError(t("measurements.updateError"));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, measurements, updateUser, showSuccess, showError, t]);

  return {
    user,
    measurementFields,
    displayValues,
    handleMeasurementChange,
    saveMeasurements,
    isSaving,
    loadUserData,
  };
}
