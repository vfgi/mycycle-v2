import { WeightRecord, MeasurementRecord, PeriodOption } from "./types";

// Dados de peso dos últimos 12 meses
export const weightMockData: WeightRecord[] = [
  // Últimos 7 dias
  {
    id: "w1",
    date: "2025-10-12",
    weight: 75.2,
    bodyFat: 12.5,
    muscleMass: 65.7,
    bmi: 22.1,
  },
  {
    id: "w2",
    date: "2025-10-11",
    weight: 75.4,
    bodyFat: 12.6,
    muscleMass: 65.5,
    bmi: 22.2,
  },
  {
    id: "w3",
    date: "2025-10-10",
    weight: 75.1,
    bodyFat: 12.4,
    muscleMass: 65.8,
    bmi: 22.1,
  },
  {
    id: "w4",
    date: "2025-10-09",
    weight: 75.3,
    bodyFat: 12.7,
    muscleMass: 65.4,
    bmi: 22.2,
  },
  {
    id: "w5",
    date: "2025-10-08",
    weight: 75.0,
    bodyFat: 12.3,
    muscleMass: 65.9,
    bmi: 22.0,
  },
  {
    id: "w6",
    date: "2025-10-07",
    weight: 74.8,
    bodyFat: 12.8,
    muscleMass: 65.2,
    bmi: 22.0,
  },
  {
    id: "w7",
    date: "2025-10-06",
    weight: 74.9,
    bodyFat: 12.9,
    muscleMass: 65.1,
    bmi: 22.0,
  },

  // Último mês
  {
    id: "w8",
    date: "2025-09-12",
    weight: 74.5,
    bodyFat: 13.2,
    muscleMass: 64.8,
    bmi: 21.9,
  },
  {
    id: "w9",
    date: "2025-08-12",
    weight: 74.0,
    bodyFat: 13.8,
    muscleMass: 64.2,
    bmi: 21.7,
  },
  {
    id: "w10",
    date: "2025-07-12",
    weight: 73.8,
    bodyFat: 14.1,
    muscleMass: 63.9,
    bmi: 21.7,
  },

  // 3 meses atrás
  {
    id: "w11",
    date: "2025-07-12",
    weight: 73.5,
    bodyFat: 14.5,
    muscleMass: 63.5,
    bmi: 21.6,
  },

  // 6 meses atrás
  {
    id: "w12",
    date: "2025-04-12",
    weight: 72.8,
    bodyFat: 15.2,
    muscleMass: 62.8,
    bmi: 21.4,
  },

  // 1 ano atrás
  {
    id: "w13",
    date: "2024-10-12",
    weight: 71.5,
    bodyFat: 16.8,
    muscleMass: 61.2,
    bmi: 21.0,
  },

  // Início (2 anos atrás)
  {
    id: "w14",
    date: "2023-10-12",
    weight: 68.2,
    bodyFat: 18.5,
    muscleMass: 58.8,
    bmi: 20.0,
  },
];

// Dados de medidas corporais
export const measurementMockData: MeasurementRecord[] = [
  // Atual
  {
    id: "m1",
    date: "2025-10-12",
    measurements: {
      chest: 102.5,
      waist: 82.0,
      hip: 98.5,
      bicep: 38.2,
      thigh: 58.5,
      neck: 38.0,
      forearm: 29.5,
      calf: 37.8,
    },
  },

  // 1 semana atrás
  {
    id: "m2",
    date: "2025-10-06",
    measurements: {
      chest: 102.2,
      waist: 82.3,
      hip: 98.8,
      bicep: 38.0,
      thigh: 58.2,
      neck: 37.8,
      forearm: 29.3,
      calf: 37.6,
    },
  },

  // 1 mês atrás
  {
    id: "m3",
    date: "2025-09-12",
    measurements: {
      chest: 101.8,
      waist: 82.8,
      hip: 99.2,
      bicep: 37.5,
      thigh: 57.8,
      neck: 37.5,
      forearm: 29.0,
      calf: 37.2,
    },
  },

  // 3 meses atrás
  {
    id: "m4",
    date: "2025-07-12",
    measurements: {
      chest: 101.0,
      waist: 83.5,
      hip: 99.8,
      bicep: 37.0,
      thigh: 57.2,
      neck: 37.2,
      forearm: 28.5,
      calf: 36.8,
    },
  },

  // 6 meses atrás
  {
    id: "m5",
    date: "2025-04-12",
    measurements: {
      chest: 100.2,
      waist: 84.2,
      hip: 100.5,
      bicep: 36.2,
      thigh: 56.5,
      neck: 36.8,
      forearm: 28.0,
      calf: 36.2,
    },
  },

  // 1 ano atrás
  {
    id: "m6",
    date: "2024-10-12",
    measurements: {
      chest: 98.5,
      waist: 85.8,
      hip: 102.0,
      bicep: 35.0,
      thigh: 55.2,
      neck: 36.2,
      forearm: 27.2,
      calf: 35.5,
    },
  },

  // Início (2 anos atrás)
  {
    id: "m7",
    date: "2023-10-12",
    measurements: {
      chest: 95.8,
      waist: 88.5,
      hip: 104.2,
      bicep: 32.5,
      thigh: 53.0,
      neck: 35.5,
      forearm: 26.0,
      calf: 34.2,
    },
  },
];

// Opções de período (as labels serão traduzidas no componente)
export const periodOptions: PeriodOption[] = [
  { key: "1week", label: "1 Semana", days: 7 },
  { key: "1month", label: "1 Mês", days: 30 },
  { key: "3months", label: "3 Meses", days: 90 },
  { key: "6months", label: "6 Meses", days: 180 },
  { key: "1year", label: "1 Ano", days: 365 },
  { key: "all", label: "Desde o Início", days: null },
];

// Função para obter dados do período selecionado
export const getDataForPeriod = (period: PeriodOption) => {
  const now = new Date();
  const cutoffDate = period.days
    ? new Date(now.getTime() - period.days * 24 * 60 * 60 * 1000)
    : new Date("2020-01-01"); // Data muito antiga para "all"

  const weightData = weightMockData
    .filter((record) => new Date(record.date) >= cutoffDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const measurementData = measurementMockData
    .filter((record) => new Date(record.date) >= cutoffDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    weightData,
    measurementData,
    oldestWeight: weightData[0],
    latestWeight: weightData[weightData.length - 1],
    oldestMeasurement: measurementData[0],
    latestMeasurement: measurementData[measurementData.length - 1],
  };
};
