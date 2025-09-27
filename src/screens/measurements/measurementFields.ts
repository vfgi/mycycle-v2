import { User } from "../../types/auth";

export interface MeasurementField {
  key: string;
  label: string;
  description: string;
  unit: string;
  isOptional: boolean;
}

export const getMeasurementFields = (
  t: (key: string) => string,
  user?: User | null,
  getUnitForMeasurement?: (type: "height" | "body") => string
): MeasurementField[] => {
  const isOptionalForMen = (field: string) => {
    const optionalForMen = [
      "back_size",
      "biceps_size",
      "forearm_size",
      "wrist_size",
      "foot_size",
    ];
    return user?.gender !== "female" && optionalForMen.includes(field);
  };

  const heightUnit = getUnitForMeasurement
    ? getUnitForMeasurement("height")
    : "cm";
  const bodyUnit = getUnitForMeasurement ? getUnitForMeasurement("body") : "cm";

  return [
    {
      key: "height",
      label: t("measurements.height.label"),
      description: t("measurements.height.description"),
      unit: heightUnit,
      isOptional: false,
    },
    {
      key: "neck_size",
      label: t("measurements.neck.label"),
      description: t("measurements.neck.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "back_size",
      label: t("measurements.back.label"),
      description: t("measurements.back.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("back_size"),
    },
    {
      key: "biceps_size",
      label: t("measurements.biceps.label"),
      description: t("measurements.biceps.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("biceps_size"),
    },
    {
      key: "forearm_size",
      label: t("measurements.forearm.label"),
      description: t("measurements.forearm.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("forearm_size"),
    },
    {
      key: "wrist_size",
      label: t("measurements.wrist.label"),
      description: t("measurements.wrist.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("wrist_size"),
    },
    {
      key: "chest_size",
      label: t("measurements.chest.label"),
      description: t("measurements.chest.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "abdomen_size",
      label: t("measurements.abdomen.label"),
      description: t("measurements.abdomen.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "waist_size",
      label: t("measurements.waist.label"),
      description: t("measurements.waist.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "hip_size",
      label: t("measurements.hip.label"),
      description: t("measurements.hip.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "thigh_size",
      label: t("measurements.thigh.label"),
      description: t("measurements.thigh.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "calf_size",
      label: t("measurements.calf.label"),
      description: t("measurements.calf.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "foot_size",
      label: t("measurements.foot.label"),
      description: t("measurements.foot.description"),
      unit: bodyUnit,
      isOptional: true,
    },
  ];
};
