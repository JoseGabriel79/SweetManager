import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { url } from "../utils/api.js";

export default function LoginScreen({ navigation, setLogin, setUsuario }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(url("/login"), { email, senha });

      setLoading(false);

      if (response.data.success) {
        const usuario = response.data.usuario;

        // garante que a imagem é uma URL válida
        if (usuario?.imagemperfil && !usuario.imagemperfil.startsWith("http")) {
          usuario.imagemperfil = null;
        }

        setUsuario(usuario);
        setLogin(true);
      } else {
        Alert.alert("Erro", response.data.error || "Falha no login.");
      }
    } catch (error) {
      setLoading(false);
      console.log("Erro login:", error.response?.data || error.message);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
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

      {loading ? (
        <ActivityIndicator size="large" color="#196496" style={{ marginVertical: 15 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonOutlineText}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E9F1FE",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#196496", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#196496",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  buttonOutline: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#196496",
    alignItems: "center",
  },
  buttonOutlineText: { color: "#196496", fontWeight: "bold", fontSize: 16 },
});
