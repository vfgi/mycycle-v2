import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { unitStorage, UnitSystem } from "../services/unitStorage";

interface UnitsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => Promise<void>;
  isLoading: boolean;
  // Conversion functions
  convertWeight: (kg: number) => { value: number; unit: string };
  convertHeight: (cm: number) => { value: number; unit: string };
  convertDistance: (km: number) => { value: number; unit: string };
  convertTemperature: (celsius: number) => { value: number; unit: string };
  formatWeight: (kg: number) => string;
  formatHeight: (cm: number) => string;
  formatDistance: (km: number) => string;
  formatTemperature: (celsius: number) => string;
  // Body measurements functions
  convertBodyMeasurement: (cm: number) => { value: number; unit: string };
  formatBodyMeasurement: (cm: number) => string;
  convertInputToMetric: (
    value: string,
    measurementType: "height" | "body"
  ) => number;
  getUnitForMeasurement: (measurementType: "height" | "body") => string;
  // Macronutrients functions
  convertMacronutrient: (grams: number) => { value: number; unit: string };
  formatMacronutrient: (grams: number) => string;
  getMacroUnit: () => string;
  // Water conversion functions
  convertWater: (liters: number) => { value: number; unit: string };
  formatWater: (liters: number) => string;
  getWaterUnit: () => string;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

interface UnitsProviderProps {
  children: ReactNode;
}

export const UnitsProvider: React.FC<UnitsProviderProps> = ({ children }) => {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("metric");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUnitSystem();
  }, []);

  const loadUnitSystem = async () => {
    try {
      setIsLoading(true);
      const system = await unitStorage.getUnitSystem();
      setUnitSystemState(system);
    } catch (error) {
      console.error("Error loading unit system:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUnitSystem = async (system: UnitSystem) => {
    try {
      // Atualizar o estado primeiro
      setUnitSystemState(system);
      // Depois salvar no storage
      await unitStorage.setUnitSystem(system);
    } catch (error) {
      console.error("Error setting unit system:", error);
      // Reverter se der erro
      const currentSystem = await unitStorage.getUnitSystem();
      setUnitSystemState(currentSystem);
      throw error;
    }
  };

  // Conversion functions
  const convertWeight = (kg: number): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      return {
        value: Math.round(kg * 2.205 * 100) / 100, // kg to lbs with 2 decimal places
        unit: "lbs",
      };
    }
    return {
      value: Math.round(kg * 100) / 100, // kg with 2 decimal places
      unit: "kg",
    };
  };

  const convertHeight = (cm: number): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return {
        value: parseFloat(`${feet}.${inches.toString().padStart(2, "0")}`),
        unit: "ft",
      };
    }
    return {
      value: cm,
      unit: "cm",
    };
  };

  const convertDistance = (km: number): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      return {
        value: Math.round(km * 0.621371 * 100) / 100, // km to miles
        unit: "mi",
      };
    }
    return {
      value: km,
      unit: "km",
    };
  };

  const convertTemperature = (
    celsius: number
  ): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      return {
        value: Math.round(((celsius * 9) / 5 + 32) * 10) / 10, // C to F
        unit: "°F",
      };
    }
    return {
      value: celsius,
      unit: "°C",
    };
  };

  const formatWeight = (kg: number): string => {
    const converted = convertWeight(kg);
    return `${converted.value} ${converted.unit}`;
  };

  const formatHeight = (cm: number): string => {
    const converted = convertHeight(cm);
    if (unitSystem === "imperial") {
      const feet = Math.floor(converted.value);
      const inches = Math.round((converted.value % 1) * 100);
      return `${feet}'${inches}"`;
    }
    return `${converted.value} ${converted.unit}`;
  };

  const formatDistance = (km: number): string => {
    const converted = convertDistance(km);
    return `${converted.value} ${converted.unit}`;
  };

  const formatTemperature = (celsius: number): string => {
    const converted = convertTemperature(celsius);
    return `${converted.value}${converted.unit}`;
  };

  // Body measurements functions
  const convertBodyMeasurement = (
    cm: number
  ): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      return {
        value: Math.round((cm / 2.54) * 10) / 10, // cm to inches
        unit: "in",
      };
    }
    return {
      value: cm,
      unit: "cm",
    };
  };

  const formatBodyMeasurement = (cm: number): string => {
    const converted = convertBodyMeasurement(cm);
    return `${converted.value} ${converted.unit}`;
  };

  const convertInputToMetric = (
    value: string,
    measurementType: "height" | "body"
  ): number => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;

    if (unitSystem === "imperial") {
      if (measurementType === "height") {
        // For height, assume input is in feet.inches format (e.g., 5.11 = 5'11")
        const feet = Math.floor(numValue);
        const inches = (numValue % 1) * 100;
        const totalInches = feet * 12 + inches;
        return Math.round(totalInches * 2.54 * 10) / 10; // inches to cm
      } else {
        // For body measurements, convert inches to cm
        return Math.round(numValue * 2.54 * 10) / 10;
      }
    }
    return numValue; // Already in metric
  };

  const getUnitForMeasurement = (
    measurementType: "height" | "body"
  ): string => {
    if (unitSystem === "imperial") {
      return measurementType === "height" ? "ft" : "in";
    }
    return "cm";
  };

  // Macronutrients conversion functions
  const convertMacronutrient = (
    grams: number
  ): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      // Convert grams to ounces (1 gram = 0.035274 ounces)
      return { value: Math.round(grams * 0.035274 * 100) / 100, unit: "oz" };
    }
    return { value: Math.round(grams * 100) / 100, unit: "g" };
  };

  const formatMacronutrient = (grams: number): string => {
    const converted = convertMacronutrient(grams);
    return `${converted.value}${converted.unit}`;
  };

  const getMacroUnit = (): string => {
    return unitSystem === "imperial" ? "oz" : "g";
  };

  // Water conversion functions
  const convertWater = (liters: number): { value: number; unit: string } => {
    if (unitSystem === "imperial") {
      return {
        value: Math.round(liters * 0.264172 * 100) / 100, // L to gal with 2 decimal places
        unit: "gal",
      };
    }
    return {
      value: Math.round(liters * 100) / 100, // L with 2 decimal places
      unit: "L",
    };
  };

  const formatWater = (liters: number): string => {
    const converted = convertWater(liters);
    return `${converted.value} ${converted.unit}`;
  };

  const getWaterUnit = (): string => {
    return unitSystem === "imperial" ? "gal" : "L";
  };

  const contextValue: UnitsContextType = {
    unitSystem,
    setUnitSystem,
    isLoading,
    convertWeight,
    convertHeight,
    convertDistance,
    convertTemperature,
    formatWeight,
    formatHeight,
    formatDistance,
    formatTemperature,
    convertBodyMeasurement,
    formatBodyMeasurement,
    convertInputToMetric,
    getUnitForMeasurement,
    convertMacronutrient,
    formatMacronutrient,
    getMacroUnit,
    convertWater,
    formatWater,
    getWaterUnit,
  };

  return (
    <UnitsContext.Provider value={contextValue}>
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = (): UnitsContextType => {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error("useUnits must be used within a UnitsProvider");
  }
  return context;
};
