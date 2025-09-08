import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import HomeScreen from "./HomeScreen";
import { useWindowDimensions } from "react-native";

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

const { width } = Dimensions.get("window")
const isSmallScreen = width < 620;

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#4fa5de84",
                        height: isSmallScreen ? 60 : 70, // muda a altura
                    },
                    tabBarActiveTintColor: "#196496",    // cor do ícone/texto ativo
                    tabBarInactiveTintColor: "#042136",   // cor do ícone/texto inativo
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: "bold",
                        fontSize: isSmallScreen ? 14 : 18, // fonte menor em telas pequenas
                    },
                    tabBarIconStyle: {
                        marginTop: isSmallScreen ? 2 : 0, // ajusta posição do ícone
                    },
                }}
            >
                <Tab.Screen
                    name="Início"
                    children={() => <HomeScreen username={"José"} />}
                    options={{
                        tabBarIcon: () => <Feather fontWeight size={isSmallScreen ? 20 : 30} name="home" color={'#042136'} />,

                    }}
                />
                <Tab.Screen
                    name="Relatórios"
                    component={ReportsScreen}
                    options={{
                        tabBarIcon: () => <Feather size={isSmallScreen ? 20 : 30} name="activity" color={'#042136'} />,
                    }}
                />
                <Tab.Screen
                    name="Configurações"
                    component={ConfigScreen}
                    options={{
                        tabBarIcon: () => <Feather size={isSmallScreen ? 20 : 30} name="settings" color={'#042136'} />,
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
        backgroundColor: "#E9F1FE",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
});

