


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import CardsHome from "./CardsHome";

export default function HomeScreen({ route }) {
  const { username } = route.params || { username: "Visitante" };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sweet Manager</Text>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{username}</Text>
          <Image
            source={require('../imagens/ImagensPerfil/pinguim.png')}
            style={styles.image}
          />
        </View>

      </View>

      <View style={styles.cards}>
        <CardsHome titulo="Vitrine" routeName="Vitrine" />
        <CardsHome titulo="Cadastrar Produtos" routeName="CadastrarProdutos" />
        <CardsHome titulo="Clientes" routeName="Clientes" />
        <CardsHome titulo="Estoque" routeName="Estoque" />
      </View>

    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1FE',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // espaço entre header e cards
  },
  cards: {
    flex: 1,                  // ocupa o resto da tela
    flexDirection: "row",     // organiza em linha
    flexWrap: "wrap",         // quebra pra próxima linha
    justifyContent: "center", // centraliza horizontalmente
    alignContent: "center",   // centraliza o conteúdo no eixo vertical
    gap: 15,
    paddingVertical: 20,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  status: { fontSize: 16, marginBottom: 10 },
  item: { fontSize: 18, marginVertical: 5, color: 'blue' },
});