import React, { useState, useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
import {
  VStack,
  Text,
  HStack,
  Pressable,
  Switch,
  Divider,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { SafeContainer } from "../../components";
import { useNavigation } from "@react-navigation/native";

export const GoalsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const goalsSections = useMemo(
    () => [
      {
        title: "Em Breve",
        items: [
          {
            key: "placeholder",
            icon: "trophy-outline",
            label: "Funcionalidades de Objetivos",
            action: "none",
            children: "Esta tela será implementada em breve",
          },
        ],
      },
    ],
    [t]
  );

  const handleItemPress = (item: any) => {
    // Implementar ações futuras aqui
  };

  const renderGoalItem = (item: any) => {
    return (
      <VStack key={item.key}>
        <Pressable
          onPress={() => handleItemPress(item)}
          p="$4"
          borderRadius="$md"
          $pressed={{
            bg: FIXED_COLORS.background[700],
          }}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" space="md" flex={1}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={FIXED_COLORS.text[50]}
              />
              <VStack flex={1}>
                <Text color={FIXED_COLORS.text[50]} fontSize="$md">
                  {item.label}
                </Text>
                {item.children && (
                  <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                    {item.children}
                  </Text>
                )}
              </VStack>
            </HStack>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={FIXED_COLORS.text[400]}
            />
          </HStack>
        </Pressable>
      </VStack>
    );
  };

  return (
    <SafeContainer>
      <ScrollView style={{ flex: 1 }}>
        <VStack flex={1} p="$0" space="lg">
          {goalsSections.map((section, sectionIndex) => (
            <VStack key={section.title} space="sm">
              <Text
                color={FIXED_COLORS.text[400]}
                fontSize="$sm"
                fontWeight="$semibold"
                textTransform="uppercase"
                letterSpacing="$sm"
                mb="$2"
              >
                {section.title}
              </Text>

              <VStack
                bg={FIXED_COLORS.background[800]}
                borderRadius="$lg"
                space="xs"
              >
                {section.items.map((item, itemIndex) => (
                  <VStack key={item.key}>
                    {renderGoalItem(item)}
                    {itemIndex < section.items.length - 1 && (
                      <Divider bg={FIXED_COLORS.background[700]} mx="$4" />
                    )}
                  </VStack>
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
