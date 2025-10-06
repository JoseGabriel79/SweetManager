import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Modal, TouchableOpacity } from "react-native";
import CardsHome from "./CardsHome";
import LoginScreen from "./LoginScreen";
import { useNavigation } from '@react-navigation/native';

// Componente do Modal

function UserDataModal({ dadosUsuario, onClose }) {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };
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
            <View>
              <Image
                source={
                  dadosUsuario?.imagemperfil
                    ? { uri: dadosUsuario.imagemperfil }
                    : require("../imagens/ImagensPerfil/pinguim.png")
                }
                style={styles.imageModal}
              />
            </View>
            <View>
              <Text style={styles.nome}>{dadosUsuario?.nome}</Text>
              <Text style={styles.email}>{dadosUsuario?.email}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.botaoSair}
              onPress={() => { handleLogout(); onClose(); }}
              activeOpacity={0.5}
            >
              <Text style={styles.textButton}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={onClose}
              activeOpacity={0.5}
            >
              <Text style={styles.textoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


// Componente de Imagem do Perfil
function ProfileImage({ dadosUsuario }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <TouchableOpacity onPress={() => setSelectedUser(dadosUsuario)}>
        <Image
          source={
            dadosUsuario?.imagemperfil
              ? { uri: dadosUsuario.imagemperfil }
              : require("../imagens/ImagensPerfil/pinguim.png")
          }
          style={styles.image}
        />
      </TouchableOpacity>

      {/* Renderiza o modal se tiver usuário selecionado */}
      {selectedUser && (
        <UserDataModal
          dadosUsuario={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}

export default function HomeScreen({ usuario }) {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sweet Manager</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {dadosUsuario.nome}
          </Text> */}
          <ProfileImage dadosUsuario={dadosUsuario} />

        </View>
      </View>

      <View style={styles.cards}>
        <CardsHome titulo="Painel de Controle" routeName="Vitrine" />
        <CardsHome titulo="Cadastrar Produtos" routeName="CadastrarProdutos" />
        <CardsHome titulo="Clientes" routeName="Clientes" />
        <CardsHome titulo="Estoque" routeName="Estoque" />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E9F1FE", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd"
  },
  imageModal: {
    width: 200,
    height: 200,
    borderRadius: 100
  },
  cards: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 15,
    paddingVertical: 20,
  }, modalFundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#e1eefbf1",
    padding: 20,
    width: "100%",
    height: "100%",
    alignItems: "center",

  },
  tituloModal: {
    fontSize: 25,
    fontWeight: "bold",
  },
  botaoFechar: {
    marginTop: 15,
    backgroundColor: "#b5b9b7ff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10
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
});
