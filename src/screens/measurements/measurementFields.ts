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
    const optionalForMen = ["back", "biceps", "forearm", "wrist", "foot"];
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
      key: "neck",
      label: t("measurements.neck.label"),
      description: t("measurements.neck.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "back",
      label: t("measurements.back.label"),
      description: t("measurements.back.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("back"),
    },
    {
      key: "biceps",
      label: t("measurements.biceps.label"),
      description: t("measurements.biceps.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("biceps"),
    },
    {
      key: "forearm",
      label: t("measurements.forearm.label"),
      description: t("measurements.forearm.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("forearm"),
    },
    {
      key: "wrist",
      label: t("measurements.wrist.label"),
      description: t("measurements.wrist.description"),
      unit: bodyUnit,
      isOptional: isOptionalForMen("wrist"),
    },
    {
      key: "chest",
      label: t("measurements.chest.label"),
      description: t("measurements.chest.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "abdomen",
      label: t("measurements.abdomen.label"),
      description: t("measurements.abdomen.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "waist",
      label: t("measurements.waist.label"),
      description: t("measurements.waist.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "hip",
      label: t("measurements.hip.label"),
      description: t("measurements.hip.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "thigh",
      label: t("measurements.thigh.label"),
      description: t("measurements.thigh.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "calf",
      label: t("measurements.calf.label"),
      description: t("measurements.calf.description"),
      unit: bodyUnit,
      isOptional: false,
    },
    {
      key: "foot",
      label: t("measurements.foot.label"),
      description: t("measurements.foot.description"),
      unit: bodyUnit,
      isOptional: true,
    },
  ];
};
