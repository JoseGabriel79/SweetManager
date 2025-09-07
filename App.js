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
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button } from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true); // começa carregando
  const [error, setError] = useState(null);

  const BASE_URL = "https://duzeapp-production.up.railway.app";

  // Função para inicializar o app
  const initUsuarios = async () => {
    setLoading(true);
    setError(null);

    try {
      // Popula usuários de teste (uma vez)
      await axios.post(`${BASE_URL}/usuarios/popular`);

      // Busca todos os usuários
      const res = await axios.get(`${BASE_URL}/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      console.log("Erro ao inicializar usuários:", err.message);
      setError("Não foi possível carregar os usuários.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initUsuarios();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuários</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && (
        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          <Button title="Tentar novamente" onPress={initUsuarios} />
        </View>
      )}

      {!loading && usuarios.length === 0 && !error && (
        <Text>Nenhum usuário encontrado.</Text>
      )}

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
