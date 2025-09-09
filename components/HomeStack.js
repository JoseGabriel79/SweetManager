import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import EstoqueScreen from "./EstoqueScreen";
import ClientesScreen from "./ClientesScreen";
import CadastrarProdutosScreen from "./CadastrarProdutosScreen";
import VitrineScreen from "./VitrineScreen";

const Stack = createStackNavigator();

export default function HomeStack() {
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
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
        initialParams={{ username: "Joao" }}
      />
      <Stack.Screen
        options={{ title: "Clientes" }}
        name="Clientes"
        component={ClientesScreen}
      />
      <Stack.Screen
        options={{ title: "Estoque" }}
        name="Estoque"
        component={EstoqueScreen}
      />
      <Stack.Screen
        options={{ title: "Vitrine" }}
        name="Vitrine"
        component={VitrineScreen}
      />
      <Stack.Screen
        options={{ title: "Cadastrar Produtos" }}
        name="CadastrarProdutos"
        component={CadastrarProdutosScreen}
      />
    </Stack.Navigator>
  );
}
