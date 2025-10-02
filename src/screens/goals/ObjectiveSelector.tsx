import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import { VStack, HStack, Text } from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { ObjectiveType } from "../../types/goals";

interface ObjectiveSelectorProps {
  selected: ObjectiveType | undefined;
  onSelect: (objective: ObjectiveType) => void;
}

export const ObjectiveSelector: React.FC<ObjectiveSelectorProps> = ({
  selected,
  onSelect,
}) => {
  const { t } = useTranslation();

  const options: {
    value: ObjectiveType;
    labelKey: string;
    image: any;
  }[] = [
    {
      value: "weightLoss",
      labelKey: "goals.weightLoss",
      image: require("../../../assets/images/lose-weight.webp"),
    },
    {
      value: "hypertrophy",
      labelKey: "goals.hypertrophy",
      image: require("../../../assets/images/hipertrofia-muscular.jpg"),
    },
    {
      value: "definition",
      labelKey: "goals.definition",
      image: require("../../../assets/images/women/definition.jpg"),
    },
  ];

  const currentImage =
    options.find((opt) => opt.value === selected)?.image || options[0].image;

  return (
    <VStack
      borderWidth={1}
      borderColor={FIXED_COLORS.background[0]}
      borderRadius="$xl"
      bg="rgba(0, 0, 0, 0.6)"
      overflow="hidden"
      justifyContent="flex-end"
      space="sm"
    >
      <ImageBackground
        source={currentImage}
        style={{
          height: 200,
          padding: 10,
          justifyContent: "flex-end",
        }}
        imageStyle={{
          opacity: 0.7,
          resizeMode: "cover",
        }}
      >
        <Text
          color={FIXED_COLORS.background[0]}
          fontSize="$md"
          fontWeight="$bold"
          mb="$2"
        >
          {t("goals.objective")}
        </Text>

        <VStack space="xs">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
            >
              <HStack
                bg={
                  selected === option.value
                    ? FIXED_COLORS.primary[600]
                    : "rgba(0, 0, 0, 0.5)"
                }
                p="$3"
                borderRadius="$lg"
                alignItems="center"
                space="sm"
              >
                <MaterialCommunityIcons
                  name={
                    selected === option.value
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={FIXED_COLORS.background[0]}
                />
                <Text
                  color={FIXED_COLORS.background[0]}
                  fontSize="$md"
                  fontWeight={selected === option.value ? "$bold" : "$normal"}
                >
                  {t(option.labelKey)}
                </Text>
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
      </ImageBackground>
    </VStack>
  );
};
