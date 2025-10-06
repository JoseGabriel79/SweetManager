import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CardsHome from "./CardsHome";
import { SafeAreaView } from "react-native-safe-area-context";
import { confirm } from "../utils/alerts";

// Componente do Modal

function UserDataModal({ dadosUsuario, onClose, onLogout }) {
  const navigation = useNavigation();
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={!!dadosUsuario} // só abre se houver dados
      onRequestClose={onClose}
    >
      <View style={styles.modalFundo}>
        <View style={styles.modalBox}>
          <Text style={styles.tituloModal}>Perfil</Text>

          <View style={styles.infoPerfil}>
            <Image
              source={
                dadosUsuario?.imagemperfil
                  ? { uri: dadosUsuario.imagemperfil }
                  : require("../imagens/ImagensPerfil/PerfilSweet.png")
              }
              style={styles.imageModal}
            />
            <View>
              <Text style={styles.nome}>{dadosUsuario?.nome}</Text>
              <Text style={styles.email}>{dadosUsuario?.email}</Text>
            </View>
          </View>

          <View style={styles.modalList}>

            <TouchableOpacity style={styles.modalItem} onPress={() => { onClose(); navigation.navigate('Configurações'); }}>
              <Feather name="settings" size={20} color="#042136" />
              <Text style={styles.modalItemText}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem} onPress={() => { onLogout(); onClose(); }}>
              <Feather name="log-out" size={20} color="#f64545" />
              <Text style={[styles.modalItemText, { color: '#f64545' }]}>Sair</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botaoFechar} onPress={onClose} activeOpacity={0.5}>
            <Text style={styles.textoFechar}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


// Componente de Imagem do Perfil
function ProfileImage({ dadosUsuario, onLogout }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <TouchableOpacity onPress={() => setSelectedUser(dadosUsuario)}>
        <Image
          source={
            dadosUsuario?.imagemperfil
              ? { uri: dadosUsuario.imagemperfil }
              : require("../imagens/ImagensPerfil/PerfilSweet.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>

      {/* Renderiza o modal se tiver usuário selecionado */}
      {selectedUser && (
        <UserDataModal
          dadosUsuario={selectedUser}
          onClose={() => setSelectedUser(null)}
          onLogout={onLogout}
        />
      )}
    </>
  );
}

export default function HomeScreen({ usuario, onLogout }) {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (usuario) {
      setDadosUsuario(usuario);
    } else {
      setDadosUsuario({ nome: "Visitante", imagemperfil: null });
    }
    setLoading(false);
  }, [usuario]);

  if (loading) {
    return (
      <View
        style={[styles.container, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color="#196496" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Sweet Manager</Text>
          <Text style={styles.welcomeText}>
            Olá, {dadosUsuario?.nome || "Visitante"}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerAction}
            onPress={() => navigation.navigate("Configurações")}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={20} color="#042136" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerAction, { backgroundColor: "#fce7e7" }]}
            onPress={() =>
              confirm("Sair", "Deseja sair da sua conta?", () => onLogout(), {
                confirmText: "Sair",
                confirmStyle: "destructive",
              })
            }
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color="#f64545" />
          </TouchableOpacity>
          <ProfileImage dadosUsuario={dadosUsuario} onLogout={onLogout} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ações rápidas</Text>
        <Text style={styles.sectionSubtitle}>Escolha uma área para começar</Text>
      </View>

      <View style={styles.cards}>
        <CardsHome titulo="Painel de Controle" routeName="Vitrine" />
        <CardsHome titulo="Cadastrar Produtos" routeName="CadastrarProdutos" />
        <CardsHome titulo="Clientes" routeName="Clientes" />
        <CardsHome titulo="Estoque" routeName="Estoque" />
      </View>
    </SafeAreaView>
  );
}

const shadowSmall = Platform.select({
  web: { boxShadow: "0 3px 8px rgba(0,0,0,0.12)" },
  default: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
});

const shadowMedium = Platform.select({
  web: { boxShadow: "0 6px 12px rgba(0,0,0,0.15)" },
  default: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F1FE", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: Platform.OS === "web" ? 1 : 0,
    borderColor: "#e5eef7",
    ...shadowSmall,
    marginBottom: 16,
  },
  headerLeft: { flexDirection: "column" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  appTitle: { fontSize: 22, fontWeight: "700", color: "#042136" },
  welcomeText: { fontSize: 14, color: "#4c5b68", marginTop: 4 },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
    borderWidth: 1,
    borderColor: "#e5eef7",
  },
  imageModal: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#E9F1FE",
  },
  headerAction: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#eef6ff",
    ...shadowSmall,
  },
  sectionHeader: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#042136" },
  sectionSubtitle: { fontSize: 13, color: "#6b7b88", marginTop: 2 },
  cards: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 16,
    paddingVertical: 16,
  }, modalFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "92%",
    borderRadius: 16,
    alignItems: "center",
    ...shadowMedium,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#042136",
    marginBottom: 12,
  },
  infoPerfil: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  modalList: {
    alignSelf: 'stretch',
    marginTop: 6,
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFD',
    borderRadius: 10,
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 15,
    color: '#042136',
    fontWeight: '500',
  },
  nome: {
    fontSize: 17,
    fontWeight: "600",
    color: "#042136",
  },
  email: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  botaoFechar: {
    backgroundColor: "#b5b9b7ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  textoFechar: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  }, textButton: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    display: 'none',
  },
});
