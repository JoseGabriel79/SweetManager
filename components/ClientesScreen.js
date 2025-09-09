import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ClientesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Clientes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6EAF8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
