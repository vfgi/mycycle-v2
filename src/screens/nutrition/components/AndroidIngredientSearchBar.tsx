import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Modal,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../theme/colors";
import { useTranslation } from "react-i18next";
import { useUnits } from "../../../contexts/UnitsContext";
import { ingredientsService } from "../../../services/ingredientsService";
import { IngredientTemplate } from "../../../types/nutrition";

interface AndroidIngredientSearchBarProps {
  onSelectIngredient: (ingredient: IngredientTemplate) => void;
  tableBase?: string;
}

export const AndroidIngredientSearchBar: React.FC<
  AndroidIngredientSearchBarProps
> = ({ onSelectIngredient, tableBase = "insa_tca" }) => {
  const { t } = useTranslation();
  const { convertMacronutrient, getMacroUnit } = useUnits();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<IngredientTemplate[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
        setShowModal(false);
        return;
      }

      setIsSearching(true);
      setShowModal(true);
      try {
        const response = await ingredientsService.searchIngredients(
          debouncedTerm,
          1,
          50,
          tableBase
        );
        setResults(response.data);
        setShowModal(true);
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
    setShowModal(false);
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setResults([]);
  };

  const renderItem = ({ item: ingredient }: { item: IngredientTemplate }) => {
    const proteinConverted = convertMacronutrient(ingredient.protein || 0);
    const carbsConverted = convertMacronutrient(ingredient.carbs || 0);
    const fatConverted = convertMacronutrient(ingredient.fat || 0);
    const fiberConverted = convertMacronutrient(ingredient.fiber || 0);

    return (
      <TouchableOpacity
        onPress={() => handleSelectIngredient(ingredient)}
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: FIXED_COLORS.background[700],
        }}
      >
        <View>
          <Text
            style={{
              color: FIXED_COLORS.text[50],
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            {ingredient.name}
          </Text>

          {/* Nutritional Info */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: FIXED_COLORS.text[400],
                fontSize: 12,
                marginRight: 16,
              }}
            >
              {ingredient.calories} kcal
            </Text>
            <Text
              style={{
                color: FIXED_COLORS.text[400],
                fontSize: 12,
                marginRight: 16,
              }}
            >
              P: {proteinConverted.value.toFixed(1)}
              {unit}
            </Text>
            <Text
              style={{
                color: FIXED_COLORS.text[400],
                fontSize: 12,
                marginRight: 16,
              }}
            >
              C: {carbsConverted.value.toFixed(1)}
              {unit}
            </Text>
            <Text
              style={{
                color: FIXED_COLORS.text[400],
                fontSize: 12,
                marginRight: 16,
              }}
            >
              G: {fatConverted.value.toFixed(1)}
              {unit}
            </Text>
            {ingredient.fiber > 0 && (
              <Text
                style={{
                  color: FIXED_COLORS.text[400],
                  fontSize: 12,
                  marginRight: 16,
                }}
              >
                F: {fiberConverted.value.toFixed(1)}
                {unit}
              </Text>
            )}
            {ingredient.sodium > 0 && (
              <Text
                style={{
                  color: FIXED_COLORS.text[400],
                  fontSize: 12,
                }}
              >
                Na: {ingredient.sodium}mg
              </Text>
            )}
          </View>

          {ingredient.description && (
            <Text
              style={{
                color: FIXED_COLORS.text[500],
                fontSize: 12,
              }}
              numberOfLines={1}
            >
              {ingredient.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ zIndex: 1000 }}>
      {/* Search Input */}
      <View
        style={{
          backgroundColor: FIXED_COLORS.background[800],
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isFocused
            ? FIXED_COLORS.primary[500]
            : FIXED_COLORS.background[600],
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={FIXED_COLORS.text[400]}
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder={t("nutrition.meals.searchIngredients")}
          placeholderTextColor={FIXED_COLORS.text[400]}
          style={{
            flex: 1,
            color: FIXED_COLORS.text[50],
            fontSize: 16,
            paddingVertical: 8,
          }}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {isSearching && (
          <ActivityIndicator
            size="small"
            color={FIXED_COLORS.primary[500]}
            style={{ marginLeft: 8 }}
          />
        )}
        {searchTerm.length > 0 && !isSearching && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={{ marginLeft: 8 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={FIXED_COLORS.text[400]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal with Results */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={closeModal}
        >
          <View
            style={{
              backgroundColor: FIXED_COLORS.background[800],
              borderRadius: 12,
              borderWidth: 1,
              borderColor: FIXED_COLORS.background[600],
              width: "90%",
              maxHeight: "70%",
              height: "70%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* Header */}
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: FIXED_COLORS.background[700],
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: FIXED_COLORS.text[50],
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {t("nutrition.meals.searchResults")}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons
                  name="close"
                  size={24}
                  color={FIXED_COLORS.text[400]}
                />
              </TouchableOpacity>
            </View>

            {/* Results */}
            {isSearching ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <ActivityIndicator
                  size="small"
                  color={FIXED_COLORS.primary[500]}
                />
                <Text
                  style={{
                    color: FIXED_COLORS.text[400],
                    fontSize: 12,
                    marginTop: 8,
                  }}
                >
                  {t("common.loading")}
                </Text>
              </View>
            ) : results.length === 0 ? (
              <View style={{ padding: 20, alignItems: "center" }}>
                <Text
                  style={{
                    color: FIXED_COLORS.text[400],
                    fontSize: 14,
                  }}
                >
                  {t("nutrition.meals.noResultsFound")}
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 10 }}
                removeClippedSubviews={false}
                renderItem={renderItem}
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
