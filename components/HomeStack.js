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
      {/* Passamos usuario via children para evitar warning */}
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <HomeScreen usuario={usuario} />}
      </Stack.Screen>

      <Stack.Screen name="Clientes" options={{ title: "Clientes" }}>
        {() => <ClientesScreen usuario={usuario} />}
      </Stack.Screen>

      <Stack.Screen name="Estoque" options={{ title: "Estoque" }}>
        {() => <EstoqueScreen usuario={usuario} />}
      </Stack.Screen>

      <Stack.Screen name="Vitrine" options={{ title: "Painel de Controle" }}>
        {() => <VitrineScreen usuario={usuario} />}
      </Stack.Screen>

      <Stack.Screen name="CadastrarProdutos" options={{ title: "Cadastrar Produtos" }}>
        {() => <CadastrarProdutosScreen usuario={usuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
