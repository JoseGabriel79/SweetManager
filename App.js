// Componente raiz do app (Expo)
// Encapsula o AppNavigator, que controla todo o fluxo de autenticação e navegação
// Observação: o estado 'usuario/login' aqui não é necessário porque AppNavigator já gerencia
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { AppNavigator } from "./components";
import 'react-native-gesture-handler';
import 'react-native-reanimated';


export default function App() {
    const [usuario, setUsuario] = useState(null); // Mantido apenas como exemplo; AppNavigator gerencia estado
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


