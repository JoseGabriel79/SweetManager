import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

// --- COMPONENTE DE LOGIN SEPARADO ---
export default function LoginScreen({ username, setUsername, password, setPassword, handleLogin }) {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCadastrar} onPress={handleLogin}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5 },
  buttonCadastrar: { backgroundColor: "red", padding: 15, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});