import React from "react";
import { VStack, HStack, Text } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../../../theme/colors";
import { useTranslation } from "../../../../hooks/useTranslation";
import { ConsumptionItem } from "./types";
import { ConsumptionItemCard } from "./ConsumptionItemCard";

interface ConsumptionItemsListProps {
  items: ConsumptionItem[];
}

export const ConsumptionItemsList: React.FC<ConsumptionItemsListProps> = ({
  items,
}) => {
  const { t } = useTranslation();

  if (items.length === 0) {
    return null;
  }

  return (
    <VStack space="sm" mt="$4">
      <HStack alignItems="center" space="sm">
        <Ionicons
          name="list-outline"
          size={18}
          color={FIXED_COLORS.primary[600]}
        />
        <Text
          color={FIXED_COLORS.text[50]}
          fontSize="$md"
          fontWeight="$semibold"
        >
          {t("history.consumption.itemsConsumedTitle")}
        </Text>
      </HStack>

      <Text color={FIXED_COLORS.text[400]} fontSize="$xs">
        {items.length}{" "}
        {items.length === 1
          ? t("history.consumption.itemRegistered")
          : t("history.consumption.itemsRegistered")}
      </Text>

      <VStack space="xs">
        {items.map((item) => (
          <ConsumptionItemCard key={item.id} item={item} />
        ))}
      </VStack>
    </VStack>
  );
};

export default ConsumptionItemsList;
