import * as ImagePicker from "expo-image-picker";

export type MealPhotoCapture = {
  base64: string;
  mimeType: string;
};

export type MealPhotoCaptureResult =
  | { status: "ok"; photo: MealPhotoCapture }
  | { status: "permission_denied" }
  | { status: "cancelled" };

export async function captureMealPhotoWithCamera(): Promise<MealPhotoCaptureResult> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    return { status: "permission_denied" };
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.75,
    base64: true,
  });

  const asset = result.assets?.[0];
  const base64 = asset?.base64;
  if (result.canceled || !base64) {
    return { status: "cancelled" };
  }

  const mimeType =
    asset.mimeType && asset.mimeType.startsWith("image/")
      ? asset.mimeType
      : "image/jpeg";

  return {
    status: "ok",
    photo: {
      base64,
      mimeType,
    },
  };
}
