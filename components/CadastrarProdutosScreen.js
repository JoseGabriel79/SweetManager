import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

export default function CadastroProdutoScreen() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleCadastro = async () => {
    if (!nome || !preco || !estoque) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const response = await fetch("https://duzeapp-production.up.railway.app/produto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          preco,
          estoque,
          descricao,
          imagem: "boloPadrao.png", // envia sempre a imagem padrão
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Sucesso", "Produto cadastrado com ID " + data.id);
        setNome("");
        setPreco("");
        setEstoque("");
        setDescricao("");
      } else {
        Alert.alert("Erro", data.error || "Falha ao cadastrar produto");
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Produto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Preço"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />

      <TextInput
        style={styles.input}
        placeholder="Estoque"
        keyboardType="numeric"
        value={estoque}
        onChangeText={setEstoque}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição"
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* Botão inativado indicando imagem padrão */}
      <TouchableOpacity style={styles.disabledButton} disabled={true}>
        <Text style={styles.disabledButtonText}>Imagem padrão já enviada</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#E9F1FE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#51AFF9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
