import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window")
const isSmallScreen = width < 520;

export default function CardsHome({ titulo, routeName }) {
  const navigation = useNavigation();

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#51AFF9",
    borderRadius: 12,
    margin: 8,
    width: "45%", // 2 cards por linha
    alignItems: "center",
    justifyContent: "center",
    height: isSmallScreen ? "20%" : "25%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
