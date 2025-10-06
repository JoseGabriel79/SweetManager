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


