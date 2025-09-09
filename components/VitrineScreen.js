import React, { use, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, Dimensions, ScrollView, TouchableOpacity, Modal } from "react-native";

const imagensBolos = {
    boloPadrao: require('../imagens/ImagensBolos/boloPadrao.png'),
};

const { width } = Dimensions.get("window")
const isSmallScreen = width < 620;

export default function VitrineScreen() {
    const [produtos, setProdutos] = useState([]);
    const [status, setStatus] = useState("Carregando...");
    const [selectedItem, setSelectedItem] = useState(null);

    const produto = [{
        id: 1,
        nome: "Bolo de Chocolate",
        descricao: "Delicioso bolo de chocolate com cobertura de brigadeiro",
        preco: 50.00,
        imagem: "boloPadrao.png",
        estoque: 7
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png",
        estoque: 15
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png",
        estoque: 7
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png",
        estoque: 7
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png",
        estoque: 7
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png",
        estoque: 7
    }, {
        id: 2,
        nome: "Bolo de Morango",
        descricao: "Bolo de morango com cobertura de chantilly",
        preco: 60.00,
        imagem: "boloPadrao.png",
        estoque: 7
    }
    ]

    useEffect(() => {
        setProdutos(produto);
        setStatus("Conectado com sucesso!");
        
    }, []);
    
    function ModalProduto({ item, onClose }) {
        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={true}
                onRequestClose={onClose}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalBox}>
                        <Text style={styles.tituloModal}>{item.nome}</Text>
                        <Image
                            source={imagensBolos[item.imagem] || imagensBolos.boloPadrao}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.itemName}>
                            {item.nome}
                        </Text>
                        <Text style={styles.itemDescricao}>
                            {item.descricao}
                        </Text>
                        <Text style={styles.itemPreco}>
                            R${item.preco.toFixed(2)}
                        </Text>
                        <Text style={styles.itemEstoque}>
                            Estoque: {item.estoque}
                        </Text>

                        <TouchableOpacity style={styles.botaoFechar} onPress={onClose}>
                            <Text style={styles.textoFechar}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
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
                    <TouchableOpacity
                        style={styles.cardVitrine}
                        activeOpacity={0.6}
                        onPress={() => setSelectedItem(item)}>


                        <Image
                            source={imagensBolos[item.imagem] || imagensBolos.boloPadrao}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.itemName}>
                            {item.nome}
                        </Text>
                        
                        <View style={styles.buttons}>

                            <TouchableOpacity
                                style={styles.buttonUpdate}
                                activeOpacity={0.3}>
                                Editar
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonDelete}
                                activeOpacity={0.3}
                            >Excluir</TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                )

                }
            />

            {selectedItem && (
                <ModalProduto
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)} // fecha modal
                />)}

        </ScrollView >



    );
}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 10,
        gap: 10,
        padding: 5,
    },
    buttonDelete: {
        height: 30,
        width: 80,
        backgroundColor: "#fa1212c0",
        borderRadius: 6,
        textAlign: "center",
        lineHeight: 30,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 15,
    },
    buttonUpdate: {
        height: 30,
        width: 80,
        backgroundColor: "#1db643f3",
        borderRadius: 6,
        textAlign: "center",
        lineHeight: 30,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 15,
    },
    container: {
        flex: 1,
        backgroundColor: "#E9F1FE",
        padding: 10, // margem da tela
    },
    row: {
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingTop: 15,
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
        height: isSmallScreen ? 180 : 200,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemName: {
        fontFamily: "Arial",
        fontSize: 16,
        fontWeight: "900",
        color: "#e9f1fe",
    },
    itemPreco: {
        fontSize: 15,
        fontWeight: "600",
        color: "#e9f1fe",
    },
    itemDescricao: {
        fontSize: 12,
        fontWeight: "600",
        color: "#e9f1fe",
    },
    itemEstoque: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1f0505ff",
    }, modalFundo: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalBox: {
        backgroundColor: "#e1eefb",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    tituloModal: {
        fontSize: 18,
        fontWeight: "bold",
    },
    botaoFechar: {
        marginTop: 15,
        backgroundColor: "#FF5252",
        padding: 10,
        borderRadius: 8,
    },
    textoFechar: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
});
