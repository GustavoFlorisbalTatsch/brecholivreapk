
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { Feather as Icon } from '@expo/vector-icons';

import {
  TouchableOpacity,
  View,
  Text
} from 'react-native';

// Importação das telas
import HomeScreen from './HomeScreen';
import ProdutosScreen from './ProdutosScreen';
import LojaVirtualScreen from './LojaVirtualScreen';
import ProdutoDetalhesScreen from './ProdutoDetalhesScreen';
import LoginScreen from './LoginScreen';
import CarrinhoScreen from './CarrinhoScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegação principal
function NavigationTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'ProdutosTab') {
            iconName = 'grid';
          } else if (route.name === 'Loja Virtual') {
            iconName = 'shopping-bag';
          }

          return (
            <Icon
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: '#0052FF',
        tabBarInactiveTintColor: '#707070',

        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingBottom: 5,
          height: 60
        },

        headerStyle: {
          backgroundColor: '#FFFFFF'
        },

        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#1A1A1A'
        },

        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 15
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{
                alignItems: 'center',
                marginRight: 14
              }}
            >
              <Icon
                name="user"
                size={18}
                color="#1A1A1A"
              />

              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '700',
                  color: '#1A1A1A',
                  marginTop: 1
                }}
              >
                Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Carrinho')}
              style={{ alignItems: 'center' }}
            >
              <Icon
                name="shopping-cart"
                size={18}
                color="#0052FF"
              />

              <Text
                style={{
                  fontSize: 9,
                  fontWeight: '700',
                  color: '#0052FF',
                  marginTop: 1
                }}
              >
                Carrinho
              </Text>
            </TouchableOpacity>
          </View>
        )
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerShown: false
        }}
      />

      <Tab.Screen
        name="ProdutosTab"
        component={ProdutosScreen}
        options={{ title: 'Produtos' }}
      />

      <Tab.Screen
        name="Loja Virtual"
        component={LojaVirtualScreen}
        options={{ title: 'Loja Virtual' }}
      />
    </Tab.Navigator>
  );
}

// Navegação entre telas
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF'
        },
        headerTintColor: '#1A1A1A',
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={NavigationTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProdutoDetalhes"
        component={ProdutoDetalhesScreen}
        options={{ title: 'Detalhes do Produto' }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Minha Conta' }}
      />

      <Stack.Screen
        name="Carrinho"
        component={CarrinhoScreen}
        options={{ title: 'Meu Carrinho' }}
      />
    </Stack.Navigator>
  );
}

// Aplicativo principal
export default function App() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
