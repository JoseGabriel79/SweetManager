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
import axios from "axios";

export default function RegisterScreen({ navigation, setLogin, setUsuario }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ pede permissão
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Ative a permissão para escolher imagens.");
      }
      const { status: camStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (camStatus !== "granted") {
        Alert.alert("Permissão negada", "Ative a permissão para usar a câmera.");
      }
    })();
  }, []);

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.image],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImagemPerfil({
        uri: asset.uri,
        base64: `data:image/jpeg;base64,${asset.base64}`,
      });
    }
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImagemPerfil({
        uri: asset.uri,
        base64: `data:image/jpeg;base64,${asset.base64}`,
      });
    }
  };

  const escolherImagem = () => {
    Alert.alert("Selecionar Imagem", "Escolha uma opção", [
      { text: "Galeria", onPress: pickFromGallery },
      { text: "Câmera", onPress: pickFromCamera },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const handleRegister = async () => {
    if (!username || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://nodejs-production-43c7.up.railway.app/usuarios",
        {
          nome: username,
          email,
          senha,
          imagemPerfil: imagemPerfil ? imagemPerfil.base64 : null,
        }
      );

      setLoading(false);

      if (response.data.success) {
        Alert.alert("Sucesso", "Cadastro realizado!");
        setUsuario(response.data.usuario);
        setLogin(true);
      } else {
        Alert.alert("Erro", response.data.error || "Não foi possível cadastrar.");
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TouchableOpacity onPress={escolherImagem} style={styles.imagePicker}>
        {imagemPerfil ? (
          <Image source={{ uri: imagemPerfil.uri }} style={styles.image} />
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
        <ActivityIndicator size="large" color="#196496" style={{ marginVertical: 15 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.goBack()}>
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
