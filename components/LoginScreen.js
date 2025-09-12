// LoginScreen.js (corrigido)
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function LoginScreen({ navigation, setLogin, setUsername, setUsuario }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("https://nodejs-production-43c7.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();

      if (data.success) {
        setUsername(data.usuario.nome);
        setUsuario(data.usuario); // 🔥 salva o objeto inteiro do usuário
        setLogin(true);
      } else {
        Alert.alert("Erro", data.error || "Credenciais inválidas");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Falha ao conectar com o servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonOutlineText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#E9F1FE" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#196496" },
  input: { width: "100%", padding: 12, marginBottom: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", backgroundColor: "#fff" },
  button: { width: "100%", paddingVertical: 14, borderRadius: 12, backgroundColor: "#196496", alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonOutline: { width: "100%", paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: "#196496", alignItems: "center" },
  buttonOutlineText: { color: "#196496", fontWeight: "bold", fontSize: 16 },
});
