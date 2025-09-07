import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function Register(){
    return <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
        style={styles.input}
        placeholder="Usuário"
        />
        <TextInput
        style={styles.input}
        placeholder="Email" 
        />
        <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        />
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
    </View>
}

style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "bold",
        },
    input: {     
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        width: "100%",
        },  
    button: {
        backgroundColor: "#8A05BE",
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
})