import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { url } from "../utils/api.js";

export default function SettingsScreen({ usuario, setUsuario, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const pickImageAndUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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
      <View style={styles.header}>
        <Image
          source={
            usuario?.imagemperfil
              ? { uri: usuario.imagemperfil }
              : require("../imagens/ImagensPerfil/pinguim.png")
          }
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>{usuario?.nome || "Usuário"}</Text>
          <Text style={styles.email}>{usuario?.email || "Sem email"}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContainer}>
        <Text style={styles.sectionTitle}>Conta</Text>

        <TouchableOpacity style={styles.item} onPress={() => setPhotoModalVisible(true)}>
          <Feather name="image" size={22} color="#042136" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Editar foto de perfil</Text>
            <Text style={styles.itemSubtitle}>Trocar ou excluir sua foto</Text>
          </View>
          <Feather name="chevron-right" size={22} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} activeOpacity={0.8}>
          <Feather name="user" size={22} color="#042136" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Informações da conta</Text>
            <Text style={styles.itemSubtitle}>Nome, email e segurança</Text>
          </View>
          <Feather name="chevron-right" size={22} color="#888" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Preferências</Text>

        <TouchableOpacity style={styles.item} activeOpacity={0.8}>
          <Feather name="moon" size={22} color="#042136" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Tema</Text>
            <Text style={styles.itemSubtitle}>Claro ou escuro</Text>
          </View>
          <Feather name="chevron-right" size={22} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} activeOpacity={0.8}>
          <Feather name="bell" size={22} color="#042136" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Notificações</Text>
            <Text style={styles.itemSubtitle}>Alertas e atualizações</Text>
          </View>
          <Feather name="chevron-right" size={22} color="#888" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Sobre</Text>

        <TouchableOpacity style={styles.item} activeOpacity={0.8}>
          <Feather name="info" size={22} color="#042136" />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Versão</Text>
            <Text style={styles.itemSubtitle}>1.0.0</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.item, { marginTop: 20 }]}
          onPress={() => {
            Alert.alert("Sair", "Deseja sair da sua conta?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive", onPress: () => { onLogout; onLogout(); } },
            ]);
          }}
        >
          <Feather name="log-out" size={22} color="#f64545" />
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemTitle, { color: "#f64545" }]}>Sair</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        transparent
        visible={photoModalVisible}
        animationType="slide"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Foto de perfil</Text>

            <View style={styles.modalRow}>
              <TouchableOpacity style={styles.modalButton} onPress={pickImageAndUpload} disabled={loading}>
                <Feather name="upload" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Trocar foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f64545" }]}
                onPress={deleteImage}
                disabled={loading}
              >
                <Feather name="trash-2" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Excluir foto</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={() => setPhotoModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>

            {loading && (
              <ActivityIndicator size="large" color="#196496" style={{ marginTop: 12 }} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D6EAF8",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#042136",
  },
  email: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  listContainer: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#042136",
    marginVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#042136",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#042136",
    marginBottom: 12,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#196496",
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#b5b9b7ff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});