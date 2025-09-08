import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList
} from "react-native";
import React, { useEffect, useState } from "react";

export default function HomeScreen({ username }) {
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState("Carregando...");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch(
          "https://nodejs-production-43c7.up.railway.app/produtos"
        );

        // Verifica se a resposta foi ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // converte diretamente para JSON

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>Sweet Manager</Text>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{username}</Text>
          <Image
            source={require('../ImagensPerfil/pinguim.png')}
            style={styles.image}
          />
        </View>
      </View>

      <Text style={styles.status}>{status}</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.nome} - R${item.preco}
          </Text>
        )}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1FE',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // deixa a imagem redonda
  },
  status: { fontSize: 16, marginBottom: 10 },
  item: { fontSize: 18, marginVertical: 5, color: 'blue' },
});




// export default function App() {





//   return (
//     <View style={styles.container}>
//
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
// });