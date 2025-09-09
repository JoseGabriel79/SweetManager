import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";

export default function VitrineScreen() {
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState("Carregando...");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch(
          "https://nodejs-production-43c7.up.railway.app/produtos"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProdutos(data.produtos);
          setStatus("Conectado com sucesso!");
        } else {
          setStatus("Erro no backend: " + JSON.stringify(data));
        }
      } catch (err) {
        setStatus("Erro: " + err.message);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardVitrine}>
            <Image
              source={require('../imagens/ImagensBolos/'+item.imagem)}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.item}>
              {item.nome} - R${item.preco}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F1FE",
    padding: 20,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#042136",
  },
  item: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
