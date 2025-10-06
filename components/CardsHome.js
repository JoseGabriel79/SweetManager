import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window")
const isSmallScreen = width < 520;

export default function CardsHome({ titulo, routeName }) {
  const navigation = useNavigation(); // pega o navigation do contexto

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.6}
      onPress={() => navigation.navigate(routeName)}
    >
      <Text style={styles.title}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const shadowSmall = Platform.select({
  web: { boxShadow: "0 3px 8px rgba(0,0,0,0.12)" },
  default: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#51AFF9",
    borderRadius: 12,
    margin: 8,
    width: isSmallScreen ? "90%" : "45%",
    alignItems: "center",
    justifyContent: "center",
    height: isSmallScreen ? "20%" : "25%",
    ...shadowSmall,
  },
  title: {
    fontSize: isSmallScreen ? 25 : 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
