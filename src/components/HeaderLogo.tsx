import React from "react";
import { Image, StyleSheet } from "react-native";

export const HeaderLogo: React.FC = () => {
  return (
    <Image
      source={require("../../assets/logo-standard.png")}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 32,
  },
});
