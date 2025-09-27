import React from "react";
import { Linking, ScrollView } from "react-native";
import { VStack, Text, HStack, Pressable, Divider } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { FIXED_COLORS } from "../theme/colors";
import { useTranslation } from "../hooks/useTranslation";
import { CustomDrawer } from "./CustomDrawer";

interface AboutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDrawer: React.FC<AboutDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  const citations = {
    bmi: {
      title: t("medical.bmiTitle"),
      formula: t("medical.bmiFormula"),
      source: t("medical.bmiSource"),
      reference: t("medical.bmiReference"),
      url: "https://www.who.int/publications/i/item/9241208546",
    },
    bodyFat: {
      title: t("medical.bodyFatTitle"),
      formulas: [
        {
          name: t("medical.bodyFatUSArmy"),
          reference: t("medical.bodyFatUSArmyRef"),
          url: "https://www.army.mil/article/2271/body-composition-program",
        },
        {
          name: t("medical.bodyFatYMCA"),
          reference: t("medical.bodyFatYMCARef"),
          url: "https://www.ymca.net/",
        },
        {
          name: t("medical.bodyFatDeurenberg"),
          reference: t("medical.bodyFatDeurenbergRef"),
          url: "https://doi.org/10.1038/sj.ijo.0800715",
        },
      ],
    },
    calories: {
      title: t("medical.caloriesTitle"),
      formulas: [
        {
          name: t("medical.mifflinFormula"),
          reference: t("medical.mifflinRef"),
          url: "https://doi.org/10.1093/ajcn/51.2.241",
        },
        {
          name: t("medical.katchFormula"),
          reference: t("medical.katchRef"),
          url: "https://www.wolterskluwer.com/en/solutions/ovid/exercise-physiology-nutrition-energy-and-human-performance-2371",
        },
      ],
    },
    tdee: {
      title: t("medical.tdeeTitle"),
      description: t("medical.tdeeDescription"),
      reference: t("medical.tdeeReference"),
      url: "https://www.nap.edu/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids",
    },
  };

  const handleOpenUrl = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  const CitationItem: React.FC<{
    title: string;
    source: string;
    url?: string;
  }> = ({ title, source, url }) => (
    <VStack
      bg={FIXED_COLORS.background[700]}
      borderRadius="$md"
      p="$3"
      space="xs"
    >
      <Text color={FIXED_COLORS.text[50]} fontSize="$sm" fontWeight="$semibold">
        {title}
      </Text>
      <Pressable onPress={() => url && handleOpenUrl(url)} disabled={!url}>
        <Text
          color={url ? FIXED_COLORS.primary[600] : FIXED_COLORS.text[400]}
          fontSize="$xs"
          textDecorationLine={url ? "underline" : "none"}
        >
          {source}
        </Text>
      </Pressable>
    </VStack>
  );

  return (
    <CustomDrawer isOpen={isOpen} onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        maxHeight={600}
        // style={{ flex: 1 }}
      >
        <VStack space="lg" p="$4">
          {/* Header */}
          <VStack space="sm" alignItems="center">
            <HStack alignItems="center" space="md">
              <Ionicons
                name="information-circle"
                size={32}
                color={FIXED_COLORS.primary[600]}
              />
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$xl"
                fontWeight="$bold"
              >
                {t("about.title")}
              </Text>
            </HStack>
          </VStack>

          {/* App Description */}
          <VStack space="md">
            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$md"
              textAlign="center"
              lineHeight="$lg"
            >
              {t("about.appDescription")}
            </Text>
          </VStack>

          <Divider bg={FIXED_COLORS.background[600]} />

          {/* Partnerships Section */}
          <VStack space="md">
            <HStack alignItems="center" space="sm">
              <Ionicons
                name="people"
                size={24}
                color={FIXED_COLORS.primary[600]}
              />
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                {t("about.partnerships")}
              </Text>
            </HStack>

            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$md"
              lineHeight="$lg"
            >
              {t("about.partnershipsDesc")}
            </Text>
          </VStack>

          <Divider bg={FIXED_COLORS.background[600]} />

          {/* Scientific Basis Section */}
          <VStack space="md">
            <HStack alignItems="center" space="sm">
              <Ionicons
                name="library"
                size={24}
                color={FIXED_COLORS.primary[600]}
              />
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$lg"
                fontWeight="$bold"
              >
                {t("about.scientificBasis")}
              </Text>
            </HStack>

            <Text
              color={FIXED_COLORS.text[300]}
              fontSize="$md"
              fontWeight="$semibold"
            >
              {t("about.calculationsTitle")}
            </Text>

            {/* BMI */}
            <CitationItem
              title={citations.bmi.title}
              source={`${citations.bmi.source} - ${citations.bmi.reference}`}
              url={citations.bmi.url}
            />

            {/* Body Fat */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {citations.bodyFat.title}
              </Text>
              {citations.bodyFat.formulas.map((formula, index) => (
                <CitationItem
                  key={index}
                  title={formula.name}
                  source={formula.reference}
                  url={formula.url}
                />
              ))}
            </VStack>

            {/* Calories */}
            <VStack space="xs">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$semibold"
              >
                {citations.calories.title}
              </Text>
              {citations.calories.formulas.map((formula, index) => (
                <CitationItem
                  key={index}
                  title={formula.name}
                  source={formula.reference}
                  url={formula.url}
                />
              ))}
            </VStack>

            {/* TDEE */}
            <CitationItem
              title={citations.tdee.title}
              source={`${citations.tdee.description} - ${citations.tdee.reference}`}
              url={citations.tdee.url}
            />
          </VStack>

          <Divider bg={FIXED_COLORS.background[600]} />

          {/* App Info */}
          <VStack space="md" alignItems="center">
            <Text
              color={FIXED_COLORS.text[400]}
              fontSize="$sm"
              fontWeight="$semibold"
            >
              {t("about.version")}: {Constants.expoConfig?.version || "2.0.0"}
            </Text>
            {Constants.expoConfig?.extra?.buildNumber && (
              <Text color={FIXED_COLORS.text[500]} fontSize="$xs">
                {t("about.buildNumber")}:{" "}
                {Constants.expoConfig.extra.buildNumber}
              </Text>
            )}
          </VStack>

          {/* Bottom Icon */}
          <VStack alignItems="center" mt="$4">
            <Ionicons
              name="fitness"
              size={48}
              color={FIXED_COLORS.primary[600]}
              style={{ opacity: 0.7 }}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </CustomDrawer>
  );
};
