// import React, {useState}from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";


// export default function CadastroProdutosScreen() {
//     const [productName, setProductName] = useState('');
//     const [description, setDescription] = useState('');
//     const [price, setPrice] = useState('');
//   return (
//     <View style={styles.container}>
//         <Text style={styles.title}>Cadastro de Produtos</Text>  
//         <TextInput style={styles.input} placeholder="Nome do Produto" value={productName} onChangeText={setProductName} />
//         <TextInput style={styles.input} placeholder="Descrição" value={description} onChangeText={setDescription} />
//         <TextInput style={styles.input} placeholder="Preço" value={price} onChangeText={setPrice} keyboardType="numeric" />
//         <TouchableOpacity style={styles.button} onPress={() => {
//             const newProduct = {
//                 id: produtos.length + 1,
//                 nome: productName,
//                 descricao: description,
//                 preco: parseFloat(price),
//             };
//             produtos.push(newProduct);
//             alert(`Produto ${productName} cadastrado com sucesso!`);
//         }}>
//             <Text style={styles.buttonText}>Cadastrar</Text>
//         </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 4,
//     padding: 12,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#8A05BE",
//     padding: 12,
//     borderRadius: 4,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });



import React, { useState } from "react";
import { View, Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

export default function App() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    const response = await fetch(image);
    const blob = await response.blob();

    // cria um caminho único
    const storageRef = ref(storage, `imagens/${Date.now()}.jpg`);

    // faz upload
    await uploadBytes(storageRef, blob);

    // pega a URL pública
    const downloadURL = await getDownloadURL(storageRef);
    setUrl(downloadURL);
  };

  return (
    <View style={{ marginTop: 50, alignItems: "center" }}>
      <Button title="Escolher imagem" onPress={pickImage} />
      <Button title="Enviar para Firebase" onPress={uploadImage} />
      {url && (
        <Image
          source={{ uri: url }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
    </View>
  );
}
