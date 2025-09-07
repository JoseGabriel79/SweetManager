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
import { View, Text, StyleSheet } from "react-native";

export default function App() {

  const [status, setStatus] = useState("Carregando...");

  useEffect(() => {
  fetch("https://duzeapp-production.up.railway.app/ping")
    .then(async (res) => {
      const text = await res.text(); // pega o que veio de verdade
      console.log("Resposta bruta:", text);

      try {
        const data = JSON.parse(text);
        setStatus("Conectado: " + JSON.stringify(data));
      } catch {
        setStatus("Não é JSON: " + text);
      }
    })
    .catch((err) => setStatus("Erro: " + err.message));
}, []);


  return (
    <View style={styles.container}>
      <Text>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
