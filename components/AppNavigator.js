import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomeStack from "./HomeStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ReportsScreen() {
  return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Tela de Relatórios</Text>
  </View>;
}

function ConfigScreen() {
  return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Tela de Configurações</Text>
  </View>;
}

// Bottom Tabs após login
function AppTabs() {
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
        name="Início"
        component={HomeStack}
        options={{ tabBarIcon: () => <Feather name="home" size={25} color="#042136" /> }}
      />
      <Tab.Screen
        name="Relatórios"
        component={ReportsScreen}
        options={{ tabBarIcon: () => <Feather name="activity" size={25} color="#042136" /> }}
      />
      <Tab.Screen
        name="Configurações"
        component={ConfigScreen}
        options={{ tabBarIcon: () => <Feather name="settings" size={25} color="#042136" /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [login, setLogin] = React.useState(false);

  return (
    <NavigationContainer>
      {login ? (
        <AppTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setLogin={setLogin} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => <RegisterScreen {...props} setLogin={setLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
// --- FIM DO COMPONENTE DE NAVEGAÇÃO ---