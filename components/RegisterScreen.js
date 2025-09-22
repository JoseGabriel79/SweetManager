import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function RegisterScreen({ navigation, setLogin, setUsuario }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [imagemperfil, setImagemPerfil] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType, // ✅ corrigido (sem deprecated)
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImagemPerfil(result.assets[0].uri); // salva URI para upload
      }
    } catch (err) {
      console.log("Erro ao escolher imagem:", err);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nome", username);
      formData.append("email", email);
      formData.append("senha", senha);

      if (imagemperfil) {
        formData.append("imagemperfil", {
          uri: imagemperfil,
          type: "image/jpeg",
          name: "perfil.jpg",
        });
      }

      const response = await fetch(
        "https://nodejs-production-43c7.up.railway.app/usuarios",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        Alert.alert("Sucesso", "Cadastro realizado!");
        setUsuario(data.usuario);
        setLogin(true);
      } else {
        Alert.alert("Erro", data.error || "Não foi possível cadastrar.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imagemperfil ? (
          <Image source={{ uri: imagemperfil }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Escolher foto de perfil</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
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
        <ActivityIndicator
          size="large"
          color="#196496"
          style={{ marginVertical: 15 }}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonOutlineText}>Voltar para Login</Text>
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
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: { color: "#555", textAlign: "center", fontSize: 12 },
  image: { width: 120, height: 120, borderRadius: 60 },
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
