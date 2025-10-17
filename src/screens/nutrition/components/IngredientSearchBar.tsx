import React, { useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Text,
  Box,
  Input,
  InputField,
  Pressable,
  ScrollView,
} from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Keyboard } from "react-native";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUnits } from "../../../contexts/UnitsContext";
import {
  IngredientTemplate,
  ingredientsService,
} from "../../../services/ingredientsService";

interface IngredientSearchBarProps {
  onSelectIngredient: (ingredient: IngredientTemplate) => void;
  tableBase?: string;
}

export const IngredientSearchBar: React.FC<IngredientSearchBarProps> = ({
  onSelectIngredient,
  tableBase = "insa_tca",
}) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IngredientTemplate[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const unit = getMacroUnit();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search ingredients
  useEffect(() => {
    const searchIngredients = async () => {
      if (debouncedTerm.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);
      try {
        const response = await ingredientsService.searchIngredients(
          debouncedTerm,
          1,
          50,
          tableBase
        );
        setResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error searching ingredients:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchIngredients();
  }, [debouncedTerm, tableBase]);

  const handleSelectIngredient = (ingredient: IngredientTemplate) => {
    onSelectIngredient(ingredient);
    setSearchTerm("");
    setResults([]);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <>
      {/* Backdrop - clicar fora fecha */}
      {showDropdown && (
        <Pressable
          onPress={handleCloseDropdown}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={999}
          bg="transparent"
        />
      )}

      <VStack space="sm" zIndex={1000}>
        <Box position="relative">
          <Input
            variant="outline"
            size="md"
            bg={FIXED_COLORS.background[800]}
            borderColor={
              isFocused
                ? FIXED_COLORS.primary[500]
                : FIXED_COLORS.background[600]
            }
            borderWidth={1}
          >
            <HStack alignItems="center" px="$3" flex={1}>
              <Ionicons
                name="search-outline"
                size={20}
                color={FIXED_COLORS.text[400]}
                style={{ marginRight: 8 }}
              />
              <InputField
                placeholder={t("nutrition.meals.searchIngredients")}
                placeholderTextColor={FIXED_COLORS.text[400]}
                color={FIXED_COLORS.text[50]}
                value={searchTerm}
                onChangeText={setSearchTerm}
                onFocus={handleFocus}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color={FIXED_COLORS.primary[500]}
                />
              )}
              {searchTerm.length > 0 && !isSearching && (
                <Pressable onPress={handleClearSearch} ml="$2">
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={FIXED_COLORS.text[400]}
                  />
                </Pressable>
              )}
            </HStack>
          </Input>

          {/* Results Dropdown - Abre para cima */}
          {showDropdown && (
            <Box
              position="absolute"
              bottom="$full"
              left={0}
              right={0}
              mb="$2"
              bg={FIXED_COLORS.background[800]}
              borderRadius="$lg"
              borderWidth={1}
              borderColor={FIXED_COLORS.background[600]}
              maxHeight={300}
              zIndex={10000}
              shadowColor="$black"
              shadowOffset={{ width: 0, height: -4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={8}
            >
              <ScrollView
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {isSearching && results.length === 0 ? (
                  <Box p="$4" alignItems="center">
                    <ActivityIndicator
                      size="small"
                      color={FIXED_COLORS.primary[500]}
                    />
                    <Text color={FIXED_COLORS.text[400]} fontSize="$xs" mt="$2">
                      {t("common.loading")}
                    </Text>
                  </Box>
                ) : results.length === 0 ? (
                  <Box p="$4" alignItems="center">
                    <Text color={FIXED_COLORS.text[400]} fontSize="$sm">
                      {t("nutrition.meals.noResultsFound")}
                    </Text>
                  </Box>
                ) : (
                  results.map((ingredient) => {
                    const proteinConverted = convertMacronutrient(
                      ingredient.protein || 0
                    );
                    const carbsConverted = convertMacronutrient(
                      ingredient.carbs || 0
                    );
                    const fatConverted = convertMacronutrient(
                      ingredient.fat || 0
                    );
                    const fiberConverted = convertMacronutrient(
                      ingredient.fiber || 0
                    );

                    return (
                      <Pressable
                        key={ingredient.id}
                        onPress={() => handleSelectIngredient(ingredient)}
                        p="$3"
                        borderBottomWidth={1}
                        borderBottomColor={FIXED_COLORS.background[700]}
                      >
                        <VStack space="xs">
                          <Text
                            color={FIXED_COLORS.text[50]}
                            fontSize="$sm"
                            fontWeight="$semibold"
                          >
                            {ingredient.name}
                          </Text>

                          {/* Nutritional Info */}
                          <HStack space="md" flexWrap="wrap">
                            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                              {ingredient.calories} kcal
                            </Text>
                            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                              P: {proteinConverted.value.toFixed(1)}
                              {unit}
                            </Text>
                            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                              C: {carbsConverted.value.toFixed(1)}
                              {unit}
                            </Text>
                            <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
                              G: {fatConverted.value.toFixed(1)}
                              {unit}
                            </Text>
                            {ingredient.fiber > 0 && (
                              <Text
                                color={FIXED_COLORS.text[400]}
                                fontSize="$xs"
                              >
                                F: {fiberConverted.value.toFixed(1)}
                                {unit}
                              </Text>
                            )}
                            {ingredient.sodium > 0 && (
                              <Text
                                color={FIXED_COLORS.text[400]}
                                fontSize="$xs"
                              >
                                Na: {ingredient.sodium}mg
                              </Text>
                            )}
                          </HStack>

                          {ingredient.description && (
                            <Text
                              color={FIXED_COLORS.text[500]}
                              fontSize="$xs"
                              numberOfLines={1}
                            >
                              {ingredient.description}
                            </Text>
                          )}
                        </VStack>
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>
            </Box>
          )}
        </Box>
      </VStack>
    </>
  );
};
