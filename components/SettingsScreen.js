import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { url } from "../utils/api.js";

export default function SettingsScreen({ usuario, setUsuario }) {
  const [loading, setLoading] = useState(false);

  const pickImageAndUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (result.canceled) return;
      const selectedUri = result.assets[0].uri;

      if (!usuario?.id) {
        Alert.alert("Erro", "Usuário não identificado para atualizar a foto.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      const timestamp = Date.now();
      const fileName = `perfil-${usuario.id}-${timestamp}.jpg`;

      try {
        const response = await fetch(selectedUri);
        const blob = await response.blob();
        formData.append("imagemperfil", blob, fileName);
      } catch (blobError) {
        const fileType = selectedUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
        formData.append("imagemperfil", { uri: selectedUri, type: fileType, name: fileName });
      }

      try {
        const resp = await fetch(url(`/usuarios/${usuario.id}/imagem`), {
          method: "PUT",
          body: formData,
        });

        const data = await resp.json();

        if (!resp.ok || !data.success) {
          throw new Error(data.error || `Falha HTTP ${resp.status}`);
        }

        setUsuario(data.usuario);
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      } catch (err) {
        console.log("Erro ao atualizar foto:", err.message);
        Alert.alert("Erro", "Não foi possível atualizar a foto.");
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.log("Erro ao escolher imagem:", err);
    }
  };

  const deleteImage = async () => {
    if (!usuario?.id) {
      Alert.alert("Erro", "Usuário não identificado para excluir a foto.");
      return;
    }

    Alert.alert(
      "Excluir foto",
      "Tem certeza que deseja excluir sua foto de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const resp = await fetch(url(`/usuarios/${usuario.id}/imagem`), { method: "DELETE" });
              const data = await resp.json();
              if (!resp.ok || !data.success) {
                throw new Error(data.error || `Falha HTTP ${resp.status}`);
              }
              setUsuario(data.usuario); // imagemperfil=null para cair na foto padrão
              Alert.alert("Sucesso", "Foto de perfil removida!");
            } catch (err) {
              console.log("Erro ao excluir foto:", err.message);
              Alert.alert("Erro", "Não foi possível excluir a foto.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <Image
        source={
          usuario?.imagemperfil
            ? { uri: usuario.imagemperfil }
            : require("../imagens/ImagensPerfil/pinguim.png")
        }
        style={styles.image}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#196496" style={{ marginVertical: 15 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={pickImageAndUpload}>
            <Text style={styles.buttonText}>Trocar foto de perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#f64545ff" }]} onPress={deleteImage}>
            <Text style={styles.buttonText}>Excluir foto de perfil</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D6EAF8",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#196496",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 220,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});