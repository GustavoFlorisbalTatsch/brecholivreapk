import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

// Adicionamos { navigation } aqui nos parâmetros para permitir mudar de tela
export default function LoginScreen({ navigation }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Função que lida com o clique nos botões de Entrar ou Cadastrar
  const handleAuth = () => {
    if (isLoginTab) {
      // Simulação de Login Temporário bem-sucedido
      Alert.alert("Sucesso", "Login efetuado com sucesso!");
    } else {
      // Simulação de Cadastro Temporário bem-sucedido
      Alert.alert("Sucesso", "Cadastro criado com sucesso!");
    }

    // REDIRECIONAMENTO DIRETO: Manda o usuário de volta para as Abas Principais (App.js)
    navigation.navigate('MainTabs');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: '#FFFFFF' }}>
      {/* Seleção de Abas Internas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, isLoginTab && styles.activeTab]} 
          onPress={() => setIsLoginTab(true)}
        >
          <Text style={[styles.tabText, isLoginTab && styles.activeTabText]}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, !isLoginTab && styles.activeTab]} 
          onPress={() => setIsLoginTab(false)}
        >
          <Text style={[styles.tabText, !isLoginTab && styles.activeTabText]}>Cadastrário</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário Dinâmico */}
      <View style={styles.formContainer}>
        {!isLoginTab && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput style={styles.input} placeholder="Seu nome" value={name} onChangeText={setName} />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            style={styles.input} 
            placeholder="exemplo@email.com" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={email} 
            onChangeText={setEmail} 
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
          />
        </View>

        {/* Adicionado o onPress={handleAuth} para disparar a navegação */}
        <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
          <Text style={styles.submitButtonText}>{isLoginTab ? 'Entrar na Conta' : 'Criar Cadastro'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 30 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFFFFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  tabText: { fontSize: 15, color: '#707070', fontWeight: '500' },
  activeTabText: { color: '#0052FF', fontWeight: 'bold' },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#1A1A1A', fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#1A1A1A' },
  submitButton: { backgroundColor: '#0052FF', borderRadius: 12, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
