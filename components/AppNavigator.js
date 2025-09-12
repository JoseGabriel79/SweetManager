import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomeStack from "./HomeStack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs após login
function AppTabs({ username }) {
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
        children={() => <HomeStack username={username} />}
        options={{
          tabBarIcon: () => <Feather name="home" size={25} color="#042136" />,
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={() => <Text style={{flex:1, justifyContent:"center", alignItems:"center"}}>Relatórios</Text>}
        options={{
          tabBarIcon: () => <Feather name="activity" size={25} color="#042136" />,
        }}
      />
      <Tab.Screen
        name="Configurações"
        component={() => <Text style={{flex:1, justifyContent:"center", alignItems:"center"}}>Configurações</Text>}
        options={{
          tabBarIcon: () => <Feather name="settings" size={25} color="#042136" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <NavigationContainer>
      {login ? (
        <AppTabs username={username} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                setLogin={setLogin}
                setUsername={setUsername}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen
                {...props}
                setLogin={setLogin}
                setUsername={setUsername}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
