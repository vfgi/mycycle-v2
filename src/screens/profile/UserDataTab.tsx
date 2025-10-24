import React, { useState } from "react";
import { VStack, HStack, Text, Divider } from "@gluestack-ui/themed";
import { TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../contexts/AuthContext";
import { CustomInput, CustomButton } from "../../components";
import { AITrainerField } from "./AITrainerField";
import { userService } from "../../services/userService";
import { userStorage } from "../../services/userStorage";
import { useToast } from "../../hooks/useToast";
import { User } from "../../types/auth";
import * as ImagePicker from "expo-image-picker";

interface InfoFieldProps {
  icon: string;
  label: string;
  value: string;
  isEditable?: boolean;
  onEdit?: () => void;
}

const InfoField: React.FC<InfoFieldProps> = ({
  icon,
  label,
  value,
  isEditable = false,
  onEdit,
}) => (
  <VStack space="sm">
    <HStack alignItems="center" justifyContent="space-between">
      <HStack alignItems="center" space="sm">
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color={FIXED_COLORS.primary[600]}
        />
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$sm"
          fontWeight="$medium"
        >
          {label}
        </Text>
      </HStack>

      {isEditable && onEdit && (
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
          <FontAwesome
            name="pencil"
            size={18}
            color={FIXED_COLORS.primary[600]}
          />
        </TouchableOpacity>
      )}
    </HStack>

    <Text color={FIXED_COLORS.text[50]} fontSize="$lg" fontWeight="$bold">
      {value}
    </Text>
  </VStack>
);

const EditableField: React.FC<{
  icon: string;
  label: string;
  value: string;
  onSave: (value: string) => void;
}> = ({ icon, label, value, onSave }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <VStack space="sm">
        <HStack alignItems="center" space="sm">
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={FIXED_COLORS.primary[600]}
          />
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$sm"
            fontWeight="$medium"
          >
            {label}
          </Text>
        </HStack>

        <CustomInput
          label=""
          placeholder={label}
          value={editValue}
          onChangeText={setEditValue}
        />

        <HStack space="sm" justifyContent="flex-end">
          <CustomButton
            text={t("common.cancel")}
            onPress={handleCancel}
            bg={FIXED_COLORS.background[700]}
            mt="$0"
            height={40}
          />
          <CustomButton
            text={t("common.save")}
            onPress={handleSave}
            mt="$0"
            height={40}
          />
        </HStack>
      </VStack>
    );
  }

  return (
    <InfoField
      icon={icon}
      label={label}
      value={value}
      isEditable={true}
      onEdit={() => setIsEditing(true)}
    />
  );
};

const SelectableField: React.FC<{
  icon: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSave: (value: string) => void;
}> = ({ icon, label, value, options, onSave }) => {
  const { t } = useTranslation();
  const [isSelecting, setIsSelecting] = React.useState(false);

  const handleSelect = (selectedValue: string) => {
    onSave(selectedValue);
    setIsSelecting(false);
  };

  if (isSelecting) {
    return (
      <VStack space="sm">
        <HStack alignItems="center" space="sm">
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={FIXED_COLORS.primary[600]}
          />
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$sm"
            fontWeight="$medium"
          >
            {label}
          </Text>
        </HStack>

        <VStack space="xs">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelect(option.value)}
              activeOpacity={0.7}
            >
              <HStack
                bg={FIXED_COLORS.background[600]}
                p="$3"
                borderRadius="$lg"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                  {option.label}
                </Text>
                {value === option.label && (
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color={FIXED_COLORS.primary[600]}
                  />
                )}
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
      </VStack>
    );
  }

  return (
    <InfoField
      icon={icon}
      label={label}
      value={value}
      isEditable={true}
      onEdit={() => setIsSelecting(true)}
    />
  );
};

export const UserDataTab: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      setIsSaving(true);

      // Primeiro tenta salvar na API
      await userService.updateProfile(updates);

      // Se API teve sucesso, então salva localmente
      const updatedUser = { ...user, ...updates };
      await userStorage.setUserProfile(updatedUser);
      updateUser(updatedUser);

      showSuccess(t("profile.updated"));
    } catch (error) {
      showError(t("profile.updateError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveName = async (newName: string) => {
    await updateUserProfile({ name: newName });
  };

  const handleSavePhone = async (newPhone: string) => {
    await updateUserProfile({ phone: newPhone });
  };

  const handleSaveAddress = async (newAddress: string) => {
    await updateUserProfile({ address: newAddress });
  };

  const handleSaveGender = async (newGender: string) => {
    await updateUserProfile({ gender: newGender });
  };

  const handleSelectProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showError(t("profile.cameraPermissionDenied"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        await handleUploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      showError(t("profile.selectImageError"));
    }
  };

  const handleUploadProfileImage = async (imageUri: string) => {
    try {
      setIsSaving(true);
      const updatedUser = await userService.uploadProfileImage(imageUri);
      updateUser(updatedUser);
      showSuccess(t("profile.imageUpdated"));
    } catch (error) {
      console.error("Error uploading image:", error);
      showError(t("profile.uploadImageError"));
    } finally {
      setIsSaving(false);
    }
  };

  const planType = user?.is_premium
    ? t("profile.premiumPlan")
    : t("profile.freePlan");

  const getGenderLabel = (gender?: string) => {
    if (!gender) return t("profile.notInformed");
    switch (gender.toLowerCase()) {
      case "male":
      case "masculino":
        return t("profile.male");
      case "female":
      case "feminino":
        return t("profile.female");
      default:
        return gender;
    }
  };

  return (
    <VStack space="lg">
      <TouchableOpacity
        onPress={handleSelectProfileImage}
        activeOpacity={0.7}
        disabled={isSaving}
      >
        <VStack
          bg={FIXED_COLORS.background[800]}
          borderRadius="$xl"
          p="$4"
          alignItems="center"
          space="sm"
        >
          <MaterialCommunityIcons
            name="camera-plus"
            size={40}
            color={FIXED_COLORS.primary[500]}
          />
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$md"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("profile.changeProfileImage")}
          </Text>
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$xs"
            textAlign="center"
          >
            {t("profile.selectProfileImageDescription")}
          </Text>
        </VStack>
      </TouchableOpacity>

      <Divider bg={FIXED_COLORS.background[700]} />

      <EditableField
        icon="rename-box"
        label={t("profile.name")}
        value={user?.name || "-"}
        onSave={handleSaveName}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <InfoField
        icon="email"
        label={t("profile.email")}
        value={user?.email || "-"}
        isEditable={false}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <EditableField
        icon="phone"
        label={t("profile.phone")}
        value={user?.phone || "-"}
        onSave={handleSavePhone}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <EditableField
        icon="map-marker"
        label={t("profile.address")}
        value={user?.address || "-"}
        onSave={handleSaveAddress}
      />

      <Divider bg={FIXED_COLORS.background[700]} />

      <SelectableField
        icon="gender-male-female"
        label={t("profile.gender")}
        value={getGenderLabel(user?.gender)}
        options={[
          { label: t("profile.male"), value: "male" },
          { label: t("profile.female"), value: "female" },
        ]}
        onSave={handleSaveGender}
      />

      {/* <Divider bg={FIXED_COLORS.background[700]} />

      <InfoField
        icon="star"
        label={t("profile.planType")}
        value={planType}
        isEditable={false}
      /> */}

      {/* TODO: Add AI Trainer Field */}

      {/* <Divider bg={FIXED_COLORS.background[700]} /> */}
      {/* <AITrainerField isPremium={user?.is_premium || true} /> */}

      <Divider bg={FIXED_COLORS.background[700]} />
      <InfoField
        icon="calendar"
        label={t("profile.memberSince")}
        value={new Date().toLocaleDateString("pt-BR")}
        isEditable={false}
      />
    </VStack>
  );
};
