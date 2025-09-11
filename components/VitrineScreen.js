import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    Modal,
    Alert,
    TextInput
} from "react-native";

const imagensBolos = {
    boloPadrao: require('../imagens/ImagensBolos/boloPadrao.png'),
};

const { width } = Dimensions.get("window")
const isSmallScreen = width < 620;

export default function VitrineScreen() {
    const [produtos, setProdutos] = useState([]);
    const [status, setStatus] = useState("Carregando...");
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemUpdate, setSelectedItemUpdate] = useState(null);
    const [selectedItemDelete, setSelectedItemDelete] = useState(null);

    // const produto = [{
    //     id: 1,
    //     nome: "Bolo de Chocolate",
    //     descricao: "Delicioso bolo de chocolate com cobertura de brigadeiro",
    //     preco: 50.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 7
    // }, {
    //     id: 2,
    //     nome: "Bolo de Morango",
    //     descricao: "Bolo de morango com cobertura de chantilly",
    //     preco: 60.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 15
    // }, {
    //     id: 2,
    //     nome: "Bolo de Morango",
    //     descricao: "Bolo de morango com cobertura de chantilly",
    //     preco: 60.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 7
    // }, {
    //     id: 2,
    //     nome: "Bolo de Morango",
    //     descricao: "Bolo de morango com cobertura de chantilly",
    //     preco: 60.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 7
    // }, {
    //     id: 2,
    //     nome: "Bolo de Morango",
    //     descricao: "Bolo de morango com cobertura de chantilly",
    //     preco: 60.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 7
    // }, {
    //     id: 2,
    //     nome: "Bolo de Morango",
    //     descricao: "Bolo de morango com cobertura de chantilly",
    //     preco: 60.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 7
    // }, {
    //     id: 2,
    //     nome: "Bolo de Morango",
    //     descricao: "Bolo de morango com cobertura de chantilly",
    //     preco: 60.00,
    //     imagem: "boloPadrao.png",
    //     estoque: 7
    // }
    // ]

    // useEffect(() => {
    //     setProdutos(produto);
    //     setStatus("Conectado com sucesso!");

    // }, []);

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
                            source={imagensBolos[item.imagemModal] || imagensBolos.boloPadrao}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.itemPrecoModal}>
                            R${Number(item.preco).toFixed(2)}
                        </Text>
                        <Text style={styles.itemDescricaoModal}>
                            {item.descricao}
                        </Text>
                        <Text style={styles.itemEstoqueModal}>
                            Estoque: {item.estoque}
                        </Text>

                        <TouchableOpacity style={styles.botaoFechar} onPress={onClose} activeOpacity={0.5}>
                            <Text style={styles.textoFechar}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    function ModalUpdateProduto({ item, onClose, onUpdateSuccess }) {
    const [nome, setNome] = useState(item.nome);
    const [preco, setPreco] = useState(item.preco.toString());
    const [estoque, setEstoque] = useState(item.estoque.toString());
    const [descricao, setDescricao] = useState(item.descricao);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/produto/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    preco: Number(preco),
                    estoque: Number(estoque),
                    descricao,
                    imagem: item.imagem,
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert("Sucesso", data.message || "Produto atualizado!");
                onUpdateSuccess(data.produto);
                onClose();
            } else {
                Alert.alert("Erro", data.error || "Não foi possível atualizar");
            }
        } catch (error) {
            Alert.alert("Erro", error.message);
        }
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={true}
            onRequestClose={onClose}
        >
            <View style={updateStyles.modalOverlay}>
                <View style={updateStyles.modalContainer}>
                    <Text style={updateStyles.modalTitle}>Editar {item.nome}</Text>

                    <TextInput
                        style={updateStyles.input}
                        placeholder="Nome do Produto"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={updateStyles.input}
                        placeholder="Preço"
                        keyboardType="numeric"
                        value={preco}
                        onChangeText={setPreco}
                    />
                    <TextInput
                        style={updateStyles.input}
                        placeholder="Estoque"
                        keyboardType="numeric"
                        value={estoque}
                        onChangeText={setEstoque}
                    />
                    <TextInput
                        style={[updateStyles.input, { height: 80 }]}
                        placeholder="Descrição"
                        multiline
                        value={descricao}
                        onChangeText={setDescricao}
                    />

                    <View style={updateStyles.buttonRow}>
                        <TouchableOpacity
                            style={[updateStyles.button, updateStyles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={updateStyles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[updateStyles.button, updateStyles.saveButton]}
                            onPress={handleUpdate}
                        >
                            <Text style={updateStyles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}




    function ModalDeleteProduto({ item, onClose, onDeleteSuccess }) {
        const handleDelete = async () => {
            try {
                const response = await fetch(`https://nodejs-production-43c7.up.railway.app/produto/${item.id}`, {
                    method: "DELETE",
                });

                const data = await response.json();

                if (data.success) {
                    Alert.alert("Sucesso", data.message || "Produto excluído com sucesso!");
                    alert("Sucesso", data.message || "Produto excluído com sucesso!");
                    onDeleteSuccess(item.id); // Atualiza lista no componente pai
                    onClose(); // Fecha o modal
                } else {
                    Alert.alert("Erro", data.error || "Não foi possível deletar");
                }
            } catch (error) {
                Alert.alert("Erro", error.message);
            }
        };

        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={true}
                onRequestClose={onClose}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalBox}>
                        <Text style={styles.tituloModal}>Excluir {item.nome}?</Text>

                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <TouchableOpacity
                                style={[styles.botaoFechar]}
                                onPress={onClose}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.textoFechar}>Fechar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.botaoFechar, { backgroundColor: "#f64545ff" }]}
                                onPress={handleDelete}
                                activeOpacity={0.5}
                            >
                                <Text style={styles.textoFechar}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }



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




            <FlatList
                numColumns={2} // 2 colunas
                data={produtos}
                keyExtractor={(item) => item.id.toString()}
                columnWrapperStyle={styles.row} // <-- deixa os itens lado a lado
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.cardVitrine}
                        activeOpacity={0.6}
                        onLongPress={() => setSelectedItem(item)}>


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
                                activeOpacity={0.3}
                                onPress={() => setSelectedItemUpdate(item)}
                            >
                                <Text style={styles.textButton}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonDelete}
                                activeOpacity={0.3}
                                onPress={() => setSelectedItemDelete(item)}
                            >
                                <Text style={styles.textButton}>Excluir</Text>
                            </TouchableOpacity>
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

            {selectedItemUpdate && (
                <ModalUpdateProduto
                    item={selectedItemUpdate}
                    onClose={() => setSelectedItemUpdate(null)}
                    onUpdateSuccess={(updatedProduto) =>
                        setProdutos(produtos.map((p) => (p.id === updatedProduto.id ? updatedProduto : p)))
                    }
                />
            )}


            {selectedItemDelete && (
                <ModalDeleteProduto
                    item={selectedItemDelete}
                    onClose={() => setSelectedItemDelete(null)}
                    onDeleteSuccess={(id) => setProdutos(produtos.filter((p) => p.id !== id))}
                />
            )}


        </View>



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
        width: isSmallScreen ? 60 : 100,
        backgroundColor: "#fa1212c0",
        borderRadius: 6,
        lineHeight: 30,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonUpdate: {
        height: 30,
        width: isSmallScreen ? 60 : 100,
        backgroundColor: "#1db643f3",
        borderRadius: 6,
        lineHeight: 30,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#E9F1FE",
        padding: 10, // margem da tela
    },
    row: {
        flex: 1,
        flexWrap: "wrap",
        justifyContent: "center",
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
        // Estilização de sombra
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#000",
        shadowOpacity: 0.1, // Opacidade da sombra
        shadowRadius: 6,
        elevation: 3, // sombra para Android
        // 🔹 Bordas arredondadas
        borderRadius: 12,
        // 🔹 Define largura do card (2 por linha)
        width: "50%",
        height: isSmallScreen ? 200 : 220,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemName: {
        fontFamily: "Arial",
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: "900",
        color: "#e9f1fe",
        textAlign: "center",

    },
    itemPrecoModal: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1f0505ff",
        fontWeight: " bold",
    },
    itemDescricaoModal: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1f0505ff",
        textAlign: "center",

    },
    itemEstoqueModal: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1f0505ff",
    },
    modalFundo: {
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
        justifyContent: "center",
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
const updateStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1f305e",
        textAlign: "center",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#f9f9f9",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    saveButton: {
        backgroundColor: "#1db643",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
