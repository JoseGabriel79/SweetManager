import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Image 
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CadastroProdutoScreen() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);

  // Função para escolher imagem da galeria
  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir acesso à galeria!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const handleCadastro = async () => {
    if (!nome || !preco || !estoque) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      // Enviando apenas a URL da imagem (simples)
      // Se precisar enviar a imagem como arquivo binário, terá que usar FormData
      const response = await fetch("http://SEU_IP:3000/produto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco, estoque, descricao, imagem }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Sucesso", "Produto cadastrado com ID " + data.id);
        setNome("");
        setPreco("");
        setEstoque("");
        setDescricao("");
        setImagem(null);
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

      <TouchableOpacity style={styles.imageButton} onPress={escolherImagem}>
        <Text style={styles.imageButtonText}>
          {imagem ? "Trocar Imagem" : "Escolher Imagem"}
        </Text>
      </TouchableOpacity>

      {imagem && (
        <Image source={{ uri: imagem }} style={styles.previewImage} />
      )}

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
  imageButton: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
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
