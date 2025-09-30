import React, { useEffect, useState } from "react";
import { VStack, HStack, Text, Image } from "@gluestack-ui/themed";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { professionalsService } from "../../services/professionalsService";
import { Professional } from "../../types/professionals";

const ProfessionalCard: React.FC<{ professional: Professional }> = ({
  professional,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <VStack
        bg={FIXED_COLORS.background[700]}
        borderRadius="$xl"
        p="$0"
        space="md"
      >
        <HStack space="md" alignItems="center">
          {professional.image_url ? (
            <Image
              source={{ uri: professional.image_url }}
              alt={professional.name}
              width={60}
              height={60}
              borderRadius={30}
              resizeMode="cover"
            />
          ) : (
            <VStack
              bg={FIXED_COLORS.background[600]}
              width={60}
              height={60}
              borderRadius={30}
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons
                name="person"
                size={32}
                color={FIXED_COLORS.primary[600]}
              />
            </VStack>
          )}

          <VStack flex={1} space="xs">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$lg"
              fontWeight="$bold"
            >
              {professional.name}
            </Text>
            <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
              {professional.profession}
            </Text>
            {professional.company && (
              <HStack alignItems="center" space="xs">
                <MaterialCommunityIcons
                  name="office-building"
                  size={14}
                  color={FIXED_COLORS.text[400]}
                />
                <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                  {professional.company}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>

        {professional.biography && (
          <Text color={FIXED_COLORS.text[300]} fontSize="$xs" numberOfLines={2}>
            {professional.biography}
          </Text>
        )}
      </VStack>
    </TouchableOpacity>
  );
};

export const ConnectionsTab: React.FC = () => {
  const { t } = useTranslation();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    try {
      setIsLoading(true);
      const data = await professionalsService.getMyProfessionals();
      setProfessionals(data);
    } catch (error) {
      console.error("Error loading professionals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <VStack
        bg={FIXED_COLORS.background[700]}
        borderRadius="$xl"
        p="$6"
        alignItems="center"
        space="md"
      >
        <Text color={FIXED_COLORS.text[50]} fontSize="$md">
          {t("common.loading")}
        </Text>
      </VStack>
    );
  }

  if (professionals.length === 0) {
    return (
      <VStack
        bg={FIXED_COLORS.background[700]}
        borderRadius="$xl"
        p="$6"
        alignItems="center"
        space="md"
      >
        <Ionicons
          name="people-circle-outline"
          size={64}
          color={FIXED_COLORS.text[400]}
        />
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$bold"
          textAlign="center"
        >
          {t("profile.noConnections")}
        </Text>
        <Text color={FIXED_COLORS.text[400]} fontSize="$sm" textAlign="center">
          {t("profile.connectWithPros")}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack space="md">
      {professionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </VStack>
  );
};
