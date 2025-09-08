// import React, { useState } from "react";
// import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Feather } from '@expo/vector-icons';
// import { 
//   LoginScreen, 
//   HomeScreen,
//   ListarProdutos,
//   CadastroProdutos 
// } from "./components";
// import {usuarios} from "./dataBase/usuarios";


// const Tab = createBottomTabNavigator();

// // --- OUTRAS TELAS ---


// function CardScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tela Cartão</Text>
//     </View>
//   );
// }

// function ProfileScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Perfil</Text>
//     </View>
//   );
// }

// // --- COMPONENTE PRINCIPAL ---
// export default function App() {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     if (!username || !password) {
//       alert('Preencha todos os campos!');
//       return;
//     }
//     if (username === usuarios[1].username && password === usuarios[1].password) {
//       setLoggedIn(true);
//     } else {
//       alert('Usuário ou senha incorretos!');
//     }
//   };

//   const handleLogout = () => {
//     setLoggedIn(false);
//     setUsername('');
//     setPassword('');
//   };

//   return loggedIn ? (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false,
//           tabBarStyle: { backgroundColor: "#8A05BE" },
//           tabBarActiveTintColor: "#fff",
//         }}
//       >
//         <Tab.Screen
//           name="Início"
//           children={() => <HomeScreen username={username} handleLogout={handleLogout} />}
//           options={{
//             tabBarIcon: () => <Feather size={28} name="home" color={'white'} />,
//           }}
//         />
//         <Tab.Screen name="Cartão" component={CardScreen} options={{
//           tabBarIcon: () => <Feather size={28} name="credit-card" color={'white'} />,
//         }} />
//         <Tab.Screen name="Perfil" component={ProfileScreen} options={{
//           tabBarIcon: () => <Feather size={28} name="user" color={'white'} />,
//         }} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   ) : (
//     <LoginScreen
//       username={username}
//       setUsername={setUsername}
//       password={password}
//       setPassword={setPassword}
//       handleLogin={handleLogin}
//     />
//   );
// }

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function App() {
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
  container: { flex: 1, padding: 20 },
  status: { fontSize: 16, marginBottom: 10 },
  item: { fontSize: 18, marginVertical: 5 },
});
