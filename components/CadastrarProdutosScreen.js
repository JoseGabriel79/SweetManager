import React, {useState}from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";


export default function CadastroProdutosScreen() {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Cadastro de Produtos</Text>  
        <TextInput style={styles.input} placeholder="Nome do Produto" value={productName} onChangeText={setProductName} />
        <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Preço" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TouchableOpacity style={styles.button} onPress={() => {
            const newProduct = {
                id: produtos.length + 1,
                nome: productName,
                descricao: description,
                preco: parseFloat(price),
            };
            produtos.push(newProduct);
            alert(`Produto ${productName} cadastrado com sucesso!`);
        }}>
            <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#8A05BE",
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

