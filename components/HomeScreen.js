import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import CardsHome from "./CardsHome";

export default function HomeScreen({ route }) {
  const [usuario, setUsuario] = useState({ nome: "Visitante", imagemPerfil: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recebe os params do LoginScreen
    const params = route.params;
    if (params && params.usuario) {
      setUsuario({
        nome: params.usuario.nome || "Visitante",
        imagemPerfil: params.usuario.imagemPerfil || null,
      });
    }
    setLoading(false);
  }, [route.params]);

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
        <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{usuario.nome}</Text>
          <Image
            source={
              usuario.imagemPerfil
                ? { uri: usuario.imagemPerfil }
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
    backgroundColor: "#ffffff",
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
    alignContent: "center",
    gap: 15,
    paddingVertical: 20,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  image: { width: 50, height: 50, borderRadius: 25 },
});
