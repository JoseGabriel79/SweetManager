// HomeStack.js (corrigido)
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import EstoqueScreen from "./EstoqueScreen";
import ClientesScreen from "./ClientesScreen";
import CadastrarProdutosScreen from "./CadastrarProdutosScreen";
import VitrineScreen from "./VitrineScreen";

const Stack = createStackNavigator();

export default function HomeStack({ usuario }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#4fa5de84" },
        headerTintColor: "#042136",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => <HomeScreen {...props} usuario={usuario} />} {/* 🔥 passa o usuário como prop */}
      </Stack.Screen>
      <Stack.Screen name="Clientes" component={ClientesScreen} options={{ title: "Clientes" }} />
      <Stack.Screen name="Estoque" component={EstoqueScreen} options={{ title: "Estoque" }} />
      <Stack.Screen name="Vitrine" component={VitrineScreen} options={{ title: "Painel de Controle" }} />
      <Stack.Screen name="CadastrarProdutos" component={CadastrarProdutosScreen} options={{ title: "Cadastrar Produtos" }} />
    </Stack.Navigator>
  );
}
