import React from "react";
import { ImageBackground } from "react-native";
import { VStack, Text, HStack, Button, ButtonText } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";

export const SupplementsHeaderCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ImageBackground
      source={require("../../../../assets/images/supplements/whey-pills.jpg")}
      style={{
        borderRadius: 16,
        overflow: "hidden",
      }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20, minHeight: 200 }}
      >
        <VStack
          space="sm"
          alignItems="center"
          flex={1}
          justifyContent="center"
        >
          <Ionicons
            name="medical"
            size={32}
            color={FIXED_COLORS.text[50]}
          />
          <Text
            color={FIXED_COLORS.text[50]}
            fontSize="$xl"
            fontWeight="$bold"
            textAlign="center"
          >
            {t("nutrition.supplements.header.title")}
          </Text>
          <Text
            color="rgba(255, 255, 255, 0.8)"
            fontSize="$sm"
            textAlign="center"
            lineHeight="$sm"
          >
            {t("nutrition.supplements.header.description")}
          </Text>
        </VStack>

        {/* Botão de criar suplemento no canto inferior direito */}
        <HStack justifyContent="flex-end" mt="$4">
          <Button
            size="sm"
            bg={FIXED_COLORS.warning[500]}
            borderRadius="$full"
            onPress={() => {
              // TODO: Navegar para tela de criar suplemento
              console.log("Criar novo suplemento");
            }}
          >
            <HStack alignItems="center" space="xs">
              <Ionicons
                name="add"
                size={16}
                color={FIXED_COLORS.text[950]}
              />
              <ButtonText
                color={FIXED_COLORS.text[950]}
                fontSize="$xs"
                fontWeight="$semibold"
              >
                {t("nutrition.supplements.header.createButton")}
              </ButtonText>
            </HStack>
          </Button>
        </HStack>
      </LinearGradient>
    </ImageBackground>
  );
};
