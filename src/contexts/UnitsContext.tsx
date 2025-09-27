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
        value: Math.round(kg * 2.205 * 10) / 10, // kg to lbs
        unit: "lbs",
      };
    }
    return {
      value: kg,
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
