import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { produtos } from "../dataBase/produtos";


export default function ListarProdutos() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Produtos</Text>
            {produtos.length > 0 ? (
                produtos.map((produto) => (
                    <View key={produto.id} style={styles.product}>
                        <Text>Nome: {produto.nome}</Text>
                        <Text>Descrição: {produto.descricao}</Text>
                        <Text>
                            Preço: R${" "}
                            {typeof produto.preco === "number"
                                ? produto.preco.toFixed(2)
                                : produto.preco}
                        </Text>
                    </View>
                ))
            ) : (
                <Text>Nenhum produto cadastrado ainda.</Text>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    product: {
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
    },
});