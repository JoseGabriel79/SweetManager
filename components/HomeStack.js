// Stack interno de navegação quando usuário está logado
// Responsável por Home, Clientes, Estoque, Vitrine e Cadastrar Produtos
// Recebe 'usuario' e 'onLogout' do AppNavigator e repassa para telas que precisam
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
      
      {/* Tela principal: oculta header e injeta usuario/onLogout */}
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {() => <HomeScreen usuario={usuario} onLogout={onLogout} />}
      </Stack.Screen>

      <Stack.Screen name="Clientes" component={ClientesScreen} options={{ title: "Clientes" }} />
      <Stack.Screen name="Estoque" component={EstoqueScreen} options={{ title: "Estoque" }} />
      {/* Lista/gestão de produtos do usuário (CRUD) */}
      <Stack.Screen name="Vitrine" options={{ title: "Painel de Controle" }}>
        {() => <VitrineScreen usuario={usuario} />}
      </Stack.Screen>
      {/* Cadastro de novos produtos; envia usuario_id para API */}
      <Stack.Screen name="CadastrarProdutos" options={{ title: "Cadastrar Produtos" }}>
        {() => <CadastrarProdutosScreen usuario={usuario} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
