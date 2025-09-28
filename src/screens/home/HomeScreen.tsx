import React from "react";
import { ScrollView } from "react-native";
import { VStack } from "@gluestack-ui/themed";
import { SafeContainer, StatsCard } from "../../components";

export const HomeScreen: React.FC = () => {
  return (
    <SafeContainer paddingHorizontal={0} paddingTop={0}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <VStack flex={1} space="lg">
          {/* Stats Card no topo */}
          <StatsCard />
        </VStack>
      </ScrollView>
    </SafeContainer>
  );
};
