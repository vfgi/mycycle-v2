import React from "react";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Box,
  ImageBackground,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

interface ExerciseCardProps {
  // Common props
  id: string;
  title: string;
  isSelected: boolean;
  onPress: () => void;

  // Image props
  imageSource: { uri: string } | any;
  imageType: "uri" | "local";

  // Optional props
  onPreview?: () => void;
  showPreview?: boolean;
  showCheckmark?: boolean;
  cardHeight?: number;
  imageHeight?: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  title,
  isSelected,
  onPress,
  imageSource,
  imageType,
  onPreview,
  showPreview = false,
  showCheckmark = true,
  cardHeight = 180,
  imageHeight = 120,
}) => {
  const { t } = useTranslation();

  const renderImage = () => {
    if (imageType === "uri") {
      return (
        <ImageBackground
          source={imageSource}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            padding: 12,
          }}
          resizeMode="cover"
        >
          {showPreview && onPreview && (
            <Box position="absolute" top="$2" right="$2">
              <Pressable
                onPress={onPreview}
                bg="rgba(0,0,0,0.5)"
                borderRadius="$full"
                p="$1"
              >
                <Ionicons name="eye" size={16} color={FIXED_COLORS.text[300]} />
              </Pressable>
            </Box>
          )}
          <VStack bg="rgba(0,0,0,0.6)" borderRadius="$md" p="$2" space="xs">
            <Text
              color={FIXED_COLORS.text[50]}
              fontSize="$sm"
              fontWeight="$semibold"
              textAlign="center"
            >
              {title}
            </Text>
            {showCheckmark && isSelected && (
              <HStack justifyContent="center">
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={FIXED_COLORS.primary[500]}
                />
              </HStack>
            )}
          </VStack>
        </ImageBackground>
      );
    }

    return (
      <ImageBackground
        source={imageSource}
        style={{
          flex: 1,
          justifyContent: "flex-end",
          padding: 12,
        }}
        resizeMode="cover"
      >
        <VStack bg="rgba(0,0,0,0.6)" borderRadius="$md" p="$2" space="xs">
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$sm"
            fontWeight="$semibold"
            textAlign="center"
          >
            {title}
          </Text>
          {showCheckmark && isSelected && (
            <HStack justifyContent="center">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={FIXED_COLORS.primary[500]}
              />
            </HStack>
          )}
        </VStack>
      </ImageBackground>
    );
  };

  return (
    <VStack flex={1} minWidth="48%" maxWidth="48%">
      <Pressable
        onPress={onPress}
        borderRadius="$lg"
        overflow="hidden"
        borderWidth={2}
        borderColor={
          isSelected ? FIXED_COLORS.primary[600] : FIXED_COLORS.background[600]
        }
        style={{ height: cardHeight }}
      >
        {renderImage()}
      </Pressable>
    </VStack>
  );
};
