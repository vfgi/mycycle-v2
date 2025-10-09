import { z } from "zod";

export const createMeasurementsSchema = (gender?: string) => {
  const isOptionalForMen = (field: string) => {
    const optionalForMen = ["back", "biceps", "forearm", "wrist", "foot"];
    return gender !== "female" && optionalForMen.includes(field);
  };

  // Schema mais flexível que permite campos vazios e só valida quando preenchidos
  return z.object({
    height: z
      .number()
      .min(100, "measurements.validation.heightMin")
      .max(250, "measurements.validation.heightMax")
      .optional(),

    weight: z
      .number()
      .min(30, "measurements.validation.weightMin")
      .max(300, "measurements.validation.weightMax")
      .optional(),

    neck: z
      .number()
      .min(25, "measurements.validation.neckMin")
      .max(60, "measurements.validation.neckMax")
      .optional(),

    back: z
      .number()
      .min(80, "measurements.validation.backMin")
      .max(150, "measurements.validation.backMax")
      .optional(),

    biceps: z
      .number()
      .min(20, "measurements.validation.bicepsMin")
      .max(60, "measurements.validation.bicepsMax")
      .optional(),

    forearm: z
      .number()
      .min(18, "measurements.validation.forearmMin")
      .max(40, "measurements.validation.forearmMax")
      .optional(),

    wrist: z
      .number()
      .min(12, "measurements.validation.wristMin")
      .max(25, "measurements.validation.wristMax")
      .optional(),

    chest: z
      .number()
      .min(60, "measurements.validation.chestMin")
      .max(150, "measurements.validation.chestMax")
      .optional(),

    abdomen: z
      .number()
      .min(50, "measurements.validation.abdomenMin")
      .max(150, "measurements.validation.abdomenMax")
      .optional(),

    waist: z
      .number()
      .min(50, "measurements.validation.waistMin")
      .max(130, "measurements.validation.waistMax")
      .optional(),

    hip: z
      .number()
      .min(60, "measurements.validation.hipMin")
      .max(150, "measurements.validation.hipMax")
      .optional(),

    thigh: z
      .number()
      .min(35, "measurements.validation.thighMin")
      .max(80, "measurements.validation.thighMax")
      .optional(),

    calf: z
      .number()
      .min(25, "measurements.validation.calfMin")
      .max(50, "measurements.validation.calfMax")
      .optional(),

    foot: z
      .number()
      .min(20, "measurements.validation.footMin")
      .max(35, "measurements.validation.footMax")
      .optional(),
  });
};

export type MeasurementsFormData = z.infer<
  ReturnType<typeof createMeasurementsSchema>
>;
