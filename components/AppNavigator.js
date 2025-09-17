import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomeStack from "./HomeStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs({ usuario }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#4fa5de84", height: 60 },
        tabBarActiveTintColor: "#196496",
        tabBarInactiveTintColor: "#042136",
        tabBarLabelStyle: { fontWeight: "bold" },
      }}
    >
      <Tab.Screen
        name="Inicio"
        children={() => <HomeStack usuario={usuario} />}
        options={{ tabBarIcon: () => <Feather name="home" size={25} color="#042136" /> }}
      />
      <Tab.Screen
        name="Relatórios"
        options={{ tabBarIcon: () => <Feather name="activity" size={25} color="#042136" /> }}
      >
        {() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Relatórios</Text>
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Configurações"
        options={{ tabBarIcon: () => <Feather name="settings" size={25} color="#042136" /> }}
      >
        {() => (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Configurações</Text>
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [login, setLogin] = useState(false);
  const [usuario, setUsuario] = useState(null);

  return (
    <NavigationContainer>
      {login ? (
        <AppTabs usuario={usuario} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setLogin={setLogin} setUsuario={setUsuario} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => <RegisterScreen {...props} setLogin={setLogin} setUsuario={setUsuario} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
