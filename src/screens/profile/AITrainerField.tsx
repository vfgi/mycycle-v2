import React from "react";
import {
  VStack,
  HStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@gluestack-ui/themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIXED_COLORS } from "../../theme/colors";
import { useTranslation } from "../../hooks/useTranslation";

interface AIFeature {
  key: string;
  usage: "unlimited" | number;
}

interface AITrainerFieldProps {
  isPremium: boolean;
  features?: AIFeature[];
}

const AIFeatureItem: React.FC<{
  label: string;
  usage: "unlimited" | number;
}> = ({ label, usage }) => {
  const { t } = useTranslation();

  return (
    <HStack justifyContent="space-between" alignItems="center">
      <Text color={FIXED_COLORS.text[300]} fontSize="$xs">
        • {label}
      </Text>
      <Text
        color={
          usage === "unlimited"
            ? FIXED_COLORS.primary[600]
            : FIXED_COLORS.success[500]
        }
        fontSize="$xs"
        fontWeight="$bold"
      >
        {usage === "unlimited"
          ? t("profile.unlimited")
          : `${usage} ${t("profile.usageRemaining")}`}
      </Text>
    </HStack>
  );
};

export const AITrainerField: React.FC<AITrainerFieldProps> = ({
  isPremium,
  features = [
    { key: "aiFeature1", usage: "unlimited" },
    { key: "aiFeature2", usage: "unlimited" },
    { key: "aiFeature3", usage: "unlimited" },
    { key: "aiFeature4", usage: "unlimited" },
    { key: "aiFeature5", usage: 15 },
  ],
}) => {
  const { t } = useTranslation();

  if (!isPremium) {
    return (
      <VStack space="sm">
        <HStack alignItems="center" space="sm">
          <MaterialCommunityIcons
            name="robot-excited"
            size={20}
            color={FIXED_COLORS.primary[600]}
          />
          <Text
            color={FIXED_COLORS.text[400]}
            fontSize="$sm"
            fontWeight="$medium"
          >
            {t("profile.aiTrainer")}
          </Text>
        </HStack>
        <Text color={FIXED_COLORS.text[50]} fontSize="$lg" fontWeight="$bold">
          {t("profile.unavailable")}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack space="sm">
      <HStack alignItems="center" space="sm">
        <MaterialCommunityIcons
          name="robot-excited"
          size={20}
          color={FIXED_COLORS.primary[600]}
        />
        <Text
          color={FIXED_COLORS.text[400]}
          fontSize="$sm"
          fontWeight="$medium"
        >
          {t("profile.aiTrainer")}
        </Text>
      </HStack>

      <Accordion
        width="100%"
        type="single"
        isCollapsible={true}
        bg="transparent"
      >
        <AccordionItem value="ai-info" bg="transparent">
          <AccordionHeader bg="transparent" p="$0">
            <AccordionTrigger bg="transparent" p="$0">
              {({ isExpanded }: { isExpanded: boolean }) => (
                <>
                  <AccordionTitleText
                    color={FIXED_COLORS.text[50]}
                    fontSize="$sm"
                    fontWeight="$bold"
                  >
                    {t("profile.viewFeatures")}
                  </AccordionTitleText>
                  <AccordionIcon
                    as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                    ml="$2"
                    color={FIXED_COLORS.primary[600]}
                  />
                </>
              )}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent bg="transparent" p="$0" pt="$2">
            <VStack space="sm">
              <Text
                color={FIXED_COLORS.text[50]}
                fontSize="$sm"
                fontWeight="$bold"
              >
                {t("profile.aiFeatures")}
              </Text>

              {features.map((feature) => (
                <AIFeatureItem
                  key={feature.key}
                  label={t(`profile.${feature.key}`)}
                  usage={feature.usage}
                />
              ))}
            </VStack>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};
