// HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import CardsHome from "./CardsHome";

export default function HomeScreen({ usuario }) {
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario) {
      setDadosUsuario({ ...usuario, imagemPerfil: usuario.imagemPerfil });
      console.log("usuario antes de passar os dados"+ usuario)
      console.log("usuario depois de passar os dados"+ dadosUsuario)
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
          
          {console.log("Imagem do perfil : ", dadosUsuario)}
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{dadosUsuario.nome}</Text>
          <Image
            source={
               { uri: dadosUsuario.imagemPerfil }
              // dadosUsuario.imagemPerfil?
                // : require("../imagens/ImagensPerfil/pinguim.png")
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
  title: { fontSize: 24, fontWeight: "bold" },
  image: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#ddd" },
  cards: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    gap: 15,
    paddingVertical: 20,
  },
});
