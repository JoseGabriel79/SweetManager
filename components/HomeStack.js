import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import EstoqueScreen from "./EstoqueScreen";
import ClientesScreen from "./ClientesScreen";
import CadastrarProdutosScreen from "./CadastrarProdutosScreen";
import VitrineScreen from "./VitrineScreen";
// Login é controlado no AppNavigator; não deve existir estado duplicado aqui.
const Stack = createStackNavigator();

export default function HomeStack({ usuario, onLogout }) {
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
        {() => <HomeScreen usuario={usuario} onLogout={onLogout} />}
      </Stack.Screen>

      <Stack.Screen name="Clientes" component={ClientesScreen} options={{ title: "Clientes" }} />
      <Stack.Screen name="Estoque" component={EstoqueScreen} options={{ title: "Estoque" }} />
      <Stack.Screen name="Vitrine" options={{ title: "Painel de Controle" }}>
        {() => <VitrineScreen usuario={usuario} />}
      </Stack.Screen>
      <Stack.Screen name="CadastrarProdutos" options={{ title: "Cadastrar Produtos" }}>
        {() => <CadastrarProdutosScreen usuario={usuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
