import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import CardsHome from "./CardsHome";

export default function HomeScreen({ usuario }) {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario) {
      let img = usuario.imagemPerfil;

      // Se imagemPerfil for base64 mas não tiver prefixo, adiciona
      if (img && !img.startsWith("data:image/")) {
        img = `data:image/jpeg;base64,${img}`;
      }

      setDadosUsuario({ ...usuario, imagemPerfil: img });
    } else {
      setDadosUsuario({ nome: "Visitante", imagemPerfil: null });
    }
    setLoading(false);
  }, [usuario]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#196496" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sweet Manager</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{dadosUsuario.nome}</Text>
          <Image
            source={
              dadosUsuario.imagemPerfil
                ? { uri: dadosUsuario.imagemPerfil }
                : require("../imagens/ImagensPerfil/pinguim.png")
            }
            style={styles.image}
          />
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
  cards: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingVertical: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  image: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ddd" },
});
