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
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://duzeapp-production.up.railway.app";

  // Função para popular usuários de teste
  const popularUsuarios = async () => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/usuarios/popular`);
      fetchUsuarios(); // busca os usuários depois de popular
    } catch (err) {
      console.log("Erro ao popular usuários:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar todos os usuários
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      console.log("Erro ao buscar usuários:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuários ao carregar a tela
  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários</Text>
      <Button
        title={loading ? "Carregando..." : "Popular Usuários de Teste"}
        onPress={popularUsuarios}
        disabled={loading}
      />
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.nome} - {item.email}</Text>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 16, marginBottom: 5 },
});
