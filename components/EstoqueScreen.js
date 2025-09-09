import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EstoqueScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Estoque</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDEBD0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
