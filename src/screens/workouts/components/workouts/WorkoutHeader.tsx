import React from "react";
import { VStack, Text } from "@gluestack-ui/themed";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { IconAnimatedButton } from "../../../../components";

interface WorkoutHeaderProps {
  title: string;
  description: string;
  onCreateWorkout?: () => void;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  title,
  description,
  onCreateWorkout,
}) => {
  return (
    <>
      <Image
        source={require("../../../../../assets/images/exercises/gym-cardio.jpg")}
        style={{
          width: "100%",
          height: 200,
          opacity: 0.4,
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
      >
        <Text
          color={FIXED_COLORS.background[0]}
          fontSize="$3xl"
          fontWeight="$bold"
          textAlign="center"
        >
          {title}
        </Text>
        <Text
          color={FIXED_COLORS.background[100]}
          fontSize="$sm"
          textAlign="center"
          lineHeight="$sm"
          px="$4"
          mt="$2"
        >
          {description}
        </Text>

        {onCreateWorkout && (
          <VStack position="absolute" bottom={16} right={16}>
            <IconAnimatedButton
              Icon={
                <Ionicons
                  name="barbell"
                  size={20}
                  color={FIXED_COLORS.text[950]}
                />
              }
              title="Criar"
              onPress={onCreateWorkout}
              buttonColor={FIXED_COLORS.primary[600]}
              textColor={FIXED_COLORS.text[950]}
            />
          </VStack>
        )}
      </VStack>
    </>
  );
};
