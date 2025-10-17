import React, { useState } from "react";
import { VStack, HStack, Text, Pressable } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { IngredientTemplate } from "../../../services/ingredientsService";
import { SelectedIngredient } from "../../../schemas/mealSchema";
import { IngredientSearchBar } from "./IngredientSearchBar";
import { SelectedIngredientCard } from "./SelectedIngredientCard";

interface IngredientsSectionProps {
  selectedIngredients: SelectedIngredient[];
  onAddIngredient: (ingredient: IngredientTemplate) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveIngredient: (id: string) => void;
}

const TABLE_OPTIONS = [
  { key: "insa_tca", label: "🇵🇹 Portugal (INSA)", flag: "🇵🇹" },
  { key: "taco", label: "🇧🇷 Brasil (TACO)", flag: "🇧🇷" },
];

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  selectedIngredients,
  onAddIngredient,
  onUpdateQuantity,
  onRemoveIngredient,
}) => {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<string>("insa_tca");

  return (
    <VStack space="md">
      <HStack justifyContent="space-between" alignItems="center">
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$lg"
          fontWeight="$semibold"
        >
          {t("nutrition.meals.ingredients")}
        </Text>

        {/* Table Selector */}
        <HStack space="xs">
          {TABLE_OPTIONS.map((table) => (
            <Pressable
              key={table.key}
              onPress={() => setSelectedTable(table.key)}
              bg={
                selectedTable === table.key
                  ? FIXED_COLORS.primary[600]
                  : FIXED_COLORS.background[700]
              }
              px="$3"
              py="$1.5"
              borderRadius="$md"
              borderWidth={1}
              borderColor={
                selectedTable === table.key
                  ? FIXED_COLORS.primary[500]
                  : FIXED_COLORS.background[600]
              }
            >
              <HStack alignItems="center" space="xs">
                <Text fontSize="$md">{table.flag}</Text>
                <Text
                  color={
                    selectedTable === table.key
                      ? FIXED_COLORS.text[950]
                      : FIXED_COLORS.text[300]
                  }
                  fontSize="$xs"
                  fontWeight="$medium"
                >
                  {table.key === "insa_tca" ? "PT" : "BR"}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </HStack>
      </HStack>

      {/* Search Bar */}
      <IngredientSearchBar
        onSelectIngredient={onAddIngredient}
        tableBase={selectedTable}
      />

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <VStack space="sm">
          {selectedIngredients.map((ingredient) => (
            <SelectedIngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onUpdateQuantity={(quantity) =>
                onUpdateQuantity(ingredient.id, quantity)
              }
              onRemove={() => onRemoveIngredient(ingredient.id)}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};
