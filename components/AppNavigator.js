import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator();

function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Relatórios</Text>
    </View>
  );
}

function ConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Configurações</Text>
    </View>
  );
}

const { width } = Dimensions.get("window");
const isSmallScreen = width < 620;

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#4fa5de84",
            height: isSmallScreen ? 60 : 70,
          },
          tabBarActiveTintColor: "#196496",
          tabBarInactiveTintColor: "#042136",
          tabBarLabelStyle: { fontWeight: "bold" },
        }}
      >
        <Tab.Screen
          name="Início"
          component={HomeStack} // <- Stack da Home
          options={{
            tabBarIcon: () => (
              <Feather
                size={isSmallScreen ? 20 : 30}
                name="home"
                color={"#042136"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Relatórios"
          component={ReportsScreen}
          options={{
            tabBarIcon: () => (
              <Feather
                size={isSmallScreen ? 20 : 30}
                name="activity"
                color={"#042136"}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Configurações"
          component={ConfigScreen}
          options={{
            tabBarIcon: () => (
              <Feather
                size={isSmallScreen ? 20 : 30}
                name="settings"
                color={"#042136"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
});
