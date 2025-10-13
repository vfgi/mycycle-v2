/**
 * Utilitários para cálculos corporais
 */

export interface UserBodyData {
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: "male" | "female";
  measurements?: {
    neck: number; // cm
    waist: number; // cm
    hip?: number; // cm (apenas para mulheres)
  };
}

/**
 * Calcula o IMC (Índice de Massa Corporal)
 * @param weight Peso em kg
 * @param height Altura em cm
 * @returns IMC calculado
 */
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

/**
 * Classifica o IMC
 * @param bmi Valor do IMC
 * @returns Classificação do IMC
 */
export const classifyBMI = (
  bmi: number
): {
  category: string;
  color: string;
} => {
  if (bmi < 18.5) {
    return { category: "underweight", color: "#3b82f6" }; // Azul
  } else if (bmi < 25) {
    return { category: "normal", color: "#10b981" }; // Verde
  } else if (bmi < 30) {
    return { category: "overweight", color: "#f59e0b" }; // Amarelo
  } else {
    return { category: "obese", color: "#ef4444" }; // Vermelho
  }
};

/**
 * Calcula o percentual de gordura corporal usando a fórmula da Marinha Americana
 * @param userData Dados do usuário
 * @returns Percentual de gordura corporal
 */
export const calculateBodyFatPercentage = (
  userData: UserBodyData
): number | null => {
  const { measurements, gender } = userData;

  if (!measurements || !measurements.neck || !measurements.waist) {
    return null;
  }

  const { neck, waist, hip } = measurements;

  if (gender === "male") {
    // Fórmula para homens: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const log10WaistNeck = Math.log10(waist - neck);
    const log10Height = Math.log10(userData.height);

    return (
      495 / (1.0324 - 0.19077 * log10WaistNeck + 0.15456 * log10Height) - 450
    );
  } else {
    // Fórmula para mulheres: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    if (!hip) return null;

    const log10WaistHipNeck = Math.log10(waist + hip - neck);
    const log10Height = Math.log10(userData.height);

    return (
      495 / (1.29579 - 0.35004 * log10WaistHipNeck + 0.221 * log10Height) - 450
    );
  }
};

/**
 * Classifica o percentual de gordura corporal
 * @param bodyFat Percentual de gordura
 * @param gender Gênero
 * @param age Idade
 * @returns Classificação da gordura corporal
 */
export const classifyBodyFat = (
  bodyFat: number,
  gender: "male" | "female",
  age: number
): {
  category: string;
  color: string;
} => {
  // Classificação baseada em idade e gênero
  let ranges: { [key: string]: number[] };

  if (gender === "male") {
    if (age <= 30) {
      ranges = {
        essential: [2, 5],
        athlete: [6, 13],
        fitness: [14, 17],
        average: [18, 24],
        obese: [25, 100],
      };
    } else if (age <= 50) {
      ranges = {
        essential: [2, 5],
        athlete: [6, 16],
        fitness: [17, 20],
        average: [21, 27],
        obese: [28, 100],
      };
    } else {
      ranges = {
        essential: [2, 5],
        athlete: [6, 19],
        fitness: [20, 23],
        average: [24, 30],
        obese: [31, 100],
      };
    }
  } else {
    if (age <= 30) {
      ranges = {
        essential: [10, 13],
        athlete: [14, 20],
        fitness: [21, 24],
        average: [25, 31],
        obese: [32, 100],
      };
    } else if (age <= 50) {
      ranges = {
        essential: [10, 13],
        athlete: [14, 23],
        fitness: [24, 27],
        average: [28, 34],
        obese: [35, 100],
      };
    } else {
      ranges = {
        essential: [10, 13],
        athlete: [14, 26],
        fitness: [27, 30],
        average: [31, 37],
        obese: [38, 100],
      };
    }
  }

  for (const [category, [min, max]] of Object.entries(ranges)) {
    if (bodyFat >= min && bodyFat <= max) {
      const colors = {
        essential: "#3b82f6", // Azul
        athlete: "#10b981", // Verde
        fitness: "#22c55e", // Verde claro
        average: "#f59e0b", // Amarelo
        obese: "#ef4444", // Vermelho
      };
      return { category, color: colors[category as keyof typeof colors] };
    }
  }

  return { category: "unknown", color: "#6b7280" };
};

/**
 * Calcula a massa muscular estimada
 * @param weight Peso total
 * @param bodyFatPercentage Percentual de gordura
 * @returns Massa muscular estimada em kg
 */
export const calculateMuscleMass = (
  weight: number,
  bodyFatPercentage: number
): number => {
  const fatMass = (weight * bodyFatPercentage) / 100;
  const leanMass = weight - fatMass;
  // Aproximadamente 40-50% da massa magra é músculo esquelético
  return leanMass * 0.45;
};

/**
 * Calcula o peso ideal baseado no IMC
 * @param height Altura em cm
 * @param targetBMI IMC alvo (padrão: 22 - meio da faixa normal)
 * @returns Peso ideal em kg
 */
export const calculateIdealWeight = (
  height: number,
  targetBMI: number = 22
): number => {
  const heightInMeters = height / 100;
  return targetBMI * (heightInMeters * heightInMeters);
};

/**
 * Processa dados do usuário e retorna métricas calculadas
 * @param userData Dados do usuário
 * @returns Objeto com todas as métricas calculadas
 */
export const processUserBodyData = (userData: UserBodyData) => {
  const bmi = calculateBMI(userData.weight, userData.height);
  const bmiClassification = classifyBMI(bmi);
  const bodyFat = calculateBodyFatPercentage(userData);
  const bodyFatClassification = bodyFat
    ? classifyBodyFat(bodyFat, userData.gender, userData.age)
    : null;
  const muscleMass = bodyFat
    ? calculateMuscleMass(userData.weight, bodyFat)
    : null;
  const idealWeight = calculateIdealWeight(userData.height);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiClassification,
    bodyFatPercentage: bodyFat ? Math.round(bodyFat * 10) / 10 : null,
    bodyFatClassification,
    muscleMass: muscleMass ? Math.round(muscleMass * 10) / 10 : null,
    idealWeight: Math.round(idealWeight * 10) / 10,
  };
};
