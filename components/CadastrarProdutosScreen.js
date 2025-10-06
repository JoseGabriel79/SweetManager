// Tela de cadastro de produtos
// - Formulário com nome, preço, estoque, descrição
// - Seleção de imagem via Expo ImagePicker
// - Envio ao backend usando FormData, incluindo 'usuario_id' do usuário logado
// - Backend armazena imagem no Supabase (bucket 'produtos') e salva URL pública
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { url } from "../utils/api.js";
import { showAlert } from "../utils/alerts";

export default function CadastroProdutoScreen({ usuario }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUri, setImagemUri] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (result.canceled) return;
      setImagemUri(result.assets[0]?.uri || null);
    } catch (err) {
      showAlert("Erro", "Falha ao selecionar imagem");
    }
  };

  const handleCadastro = async () => {
    if (!nome || !preco || !estoque) {
      showAlert("Erro", "Preencha todos os campos obrigatórios!");
      return;
    }

    if (!usuario?.id) {
      showAlert("Erro", "Usuário não identificado");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("preco", String(parseFloat(preco)));
      formData.append("estoque", String(parseInt(estoque)));
      formData.append("descricao", descricao || "");
      formData.append("usuario_id", String(usuario.id));

      if (imagemUri) {
        const timestamp = Date.now();
        const fileName = `produto-${usuario.id}-${timestamp}.jpg`;
        // Tenta obter blob no ambiente web; fallback para RN
        try {
          const resp = await fetch(imagemUri);
          const blob = await resp.blob();
          formData.append("imagemproduto", blob, fileName);
        } catch (e) {
          const fileType = imagemUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
          formData.append("imagemproduto", { uri: imagemUri, type: fileType, name: fileName });
        }
      }

      const response = await fetch(url("/produto"), {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showAlert("Sucesso", `Produto cadastrado com ID ${data.id}`);
        setNome("");
        setPreco("");
        setEstoque("");
        setDescricao("");
        setImagemUri(null);
      } else {
        showAlert("Erro", data.error || "Falha ao cadastrar produto");
      }
    } catch (error) {
      showAlert("Erro", error.message);
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

      {/* Imagem do produto (opcional) */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imagemUri ? (
          <Image source={{ uri: imagemUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.imagePickerText}>Escolher foto do produto (opcional)</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: "#E9F1FE" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: "#fff" },
  imagePicker: { backgroundColor: "#fff", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 15, borderWidth: 1, borderColor: "#ccc" },
  imagePickerText: { color: "#042136", fontWeight: "bold" },
  previewImage: { width: "100%", height: 160, borderRadius: 8 },
  button: { backgroundColor: "#51AFF9", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
