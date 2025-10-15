import React from "react";
import { VStack, Text, Box } from "@gluestack-ui/themed";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { IconAnimatedButton } from "../../../../components";

interface TrainingPlanHeaderProps {
  onCreateNewPlan: () => void;
}

export const TrainingPlanHeader: React.FC<TrainingPlanHeaderProps> = ({
  onCreateNewPlan,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Image
        source={require("../../../../../assets/images/exercises/back.jpg")}
        style={{
          width: "100%",
          height: 200,
          opacity: 0.7,
        }}
        resizeMode="cover"
      />

      <VStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        height={200}
        alignItems="center"
        justifyContent="center"
        bg="rgba(0, 0, 0, 0.3)"
        px="$4"
      >
        <Text
          color={FIXED_COLORS.background[0]}
          fontSize="$3xl"
          fontWeight="$bold"
          textAlign="center"
        >
          {t("workouts.trainingPlans")}
        </Text>
        <Text
          color={FIXED_COLORS.background[100]}
          fontSize="$sm"
          textAlign="center"
          lineHeight="$sm"
          px="$4"
          mt="$2"
        >
          {t("workouts.plansDescription")}
        </Text>

        {/* Botão Criar Plano */}
        <Box position="absolute" bottom={16} right={16}>
          <IconAnimatedButton
            title={t("workouts.createNewPlan")}
            onPress={onCreateNewPlan}
            buttonColor="#FFB800"
            textColor={FIXED_COLORS.background[950]}
            reduceMotion="never"
            Icon={
              <Ionicons
                name="barbell"
                size={16}
                color={FIXED_COLORS.background[950]}
              />
            }
          />
        </Box>
      </VStack>
    </>
  );
};
