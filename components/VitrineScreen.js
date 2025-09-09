import React, { use, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ScrollView } from "react-native";

const imagensBolos = {
    boloPadrao: require('../imagens/ImagensBolos/boloPadrao.png'),
};

const { width } = Dimensions.get("window")
const isSmallScreen = width < 620;

export default function VitrineScreen() {
    const [produtos, setProdutos] = useState([]);
    const [status, setStatus] = useState("Carregando...");
    const produto = [{
        id: 1,
        nome: "Bolo de Chocolate",
        descricao: "Delicioso bolo de chocolate com cobertura de brigadeiro",
        preco: 50.00,
        imagem: "boloPadrao.png"
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png"
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png"
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png"
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png"
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png"
    },  {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png"
    }
]

    useEffect(() => {
        setProdutos(produto);
        setStatus("Conectado com sucesso!");

    }, []);


    // useEffect(() => {
    //     const fetchProdutos = async () => {
    //         try {
    //             const response = await fetch(
    //                 "https://nodejs-production-43c7.up.railway.app/produtos"
    //             );

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             const data = await response.json();

    //             if (data.success) {
    //                 setProdutos(data.produtos);
    //                 setStatus("Conectado com sucesso!");
    //             } else {
    //                 setStatus("Erro no backend: " + JSON.stringify(data));
    //             }
    //         } catch (err) {
    //             setStatus("Erro: " + err.message);
    //         }
    //     };

    //     fetchProdutos();
    // }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.status}>{status}</Text>

            <FlatList
                numColumns={2} // 2 colunas
                data={produtos}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={styles.row} // <-- deixa os itens lado a lado
                renderItem={({ item }) => (
                    <View style={styles.cardVitrine}>
                        <Image
                            source={imagensBolos[item.imagem] || imagensBolos.boloPadrao}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.item}>
                            {item.nome} - R${item.preco}
                        </Text>
                    </View>
                )}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F1FE",
    padding: 10, // margem da tela
  },
  row: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#042136",
  },
  cardVitrine: {
    flex: 1,
    backgroundColor: "#2689cbd6",
    padding: 10,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 180, // altura fixa (senão pode colapsar)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderRadius: 12,
    // 🔹 Define largura do card (2 por linha)
    width: "45%", 
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
