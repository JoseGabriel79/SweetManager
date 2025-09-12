
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
//     ) : (
//     <LoginScreen
//       username={username}
//       setUsername={setUsername}
//       password={password}
//       setPassword={setPassword}
//       handleLogin={handleLogin}
//     />
//   );
// }


import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AppNavigator } from "./components";
import 'react-native-gesture-handler';
import 'react-native-reanimated';


export default function App() {
    const [usuario, setUsuario] = useState(null); // 🔹 aqui fica salvo o usuário logado
    const [login, setLogin] = useState(false);
    
    return (<View style={style.container}>
        <AppNavigator />
    </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
});


