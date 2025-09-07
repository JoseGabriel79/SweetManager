import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import ListarProdutos from './ListarProdutos';

export default function HomeScreen({ username, handleLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {username}!</Text>

      <ListarProdutos />

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#8A05BE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
