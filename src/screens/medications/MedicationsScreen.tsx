import React from "react";
import { VStack, ScrollView } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { SafeContainer, AdBanner } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { MedicationsHeaderCard, MedicationsList } from "./components";

export const MedicationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const isPremium = user?.is_premium || false;

  const handleViewAll = () => {
    navigation.navigate("MedicationsManagement" as never);
  };

  return (
    <SafeContainer paddingTop={0} paddingBottom={0} paddingHorizontal={0}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <VStack space="lg">
          {/* Ad Banner */}
          {!isPremium && <AdBanner />}

          {/* Header Card */}
          <MedicationsHeaderCard />

          {/* Lista de Medicamentos */}
          <MedicationsList onViewAll={handleViewAll} />
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
