import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

export default function LojaVirtualScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoryId] = useState('1'); 
  const [condicao, setCondicao] = useState('usado');     
  const [imagemUrl, setImagemUrl] = useState('');       

  const executarCadastro = async () => {
    // 1. Validação Visual Imediata para o Usuário
    if (!nome.trim() || !preco.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, digite o Nome e o Preço do desapego.");
      return;
    }

    // 2. Limpeza do Preço (Trata '100,00' para virar '100.00' numérico)
    const precoLimpo = parseFloat(preco.replace('.', '').replace(',', '.'));
    if (isNaN(precoLimpo)) {
      Alert.alert("Preço Inválido", "Por favor, digite um valor numérico correto para o preço.");
      return;
    }

    // 3. Montagem do payload seguindo as colunas exatas do seu banco de dados MySQL
    const dadosProduto = {
      nome: nome.trim(),
      preco: precoLimpo,
      descricao: descricao.trim() || "Nenhum detalhe adicional fornecido.",
      condicao: condicao.toLowerCase().trim(), 
      categoria_id: parseInt(categoriaId) || 1,
      imagem_url: imagemUrl.trim() !== '' 
        ? imagemUrl.trim() 
        : "https://unsplash.com"
    };

    try {
      // 4. Executa a chamada HTTP via fetch() conforme o indicador de avaliação 3
      const response = await fetch('http://localhost:3000/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosProduto)
      });

      const respostaServidor = await response.json();

      if (respostaServidor.sucesso) {
        Alert.alert("Sucesso 🎉", "O produto foi salvo e injetado com sucesso no MySQL!");
        
        // Limpa todas as caixas de texto após o sucesso
        setNome('');
        setPreco('');
        setDescricao('');
        setImagemUrl('');
        setCategoryId('1');
        setCondicao('usado');
        
        // Redireciona para o catálogo de produtos (Garantindo a consistência do fluxo)
        if (navigation) {
          navigation.navigate('ProdutosTab');
        }
      } else {
        Alert.alert("Erro no Servidor", respostaServidor.mensagem || "Não foi possível cadastrar.");
      }

    } catch (erro) {
      console.error("Erro na integração fetch:", erro);
      Alert.alert(
        "Erro de Comunicação", 
        "Não foi possível conectar à API do Express. Certifique-se de que rodou o comando 'node server.js' no terminal."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: '#FFFFFF' }}>
      <Text style={styles.dashboardTitle}>Painel do Vendedor: ASDSADSADSAD</Text>
      <Text style={styles.subtitle}>Gestão de Estoque & Publicação Direta (MySQL Integrado)</Text>

      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome da Peça / Produto</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Camisa Xadrez Flanela Vintage" 
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preço de Venda (R$)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="100,00" 
            keyboardType="numeric"
            value={preco}
            onChangeText={setPreco}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ID da Categoria (1 a 8)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="1 = Roupas, 2 = Calçados, 3 = Acessórios..." 
            keyboardType="numeric"
            value={categoriaId}
            onChangeText={setCategoryId}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condição do Desapego (novo, seminovo, usado)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Digite exatamente: novo, seminovo ou usado" 
            autoCapitalize="none"
            value={condicao}
            onChangeText={setCondicao}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>URL da Imagem / Foto do Produto</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Cole o link da foto aqui (http://... ou https://...)" 
            autoCapitalize="none"
            keyboardType="url"
            value={imagemUrl}
            onChangeText={setImagemUrl}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição / Detalhes de Uso</Text>
          <TextInput 
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]} 
            placeholder="Descreva o estado, tamanho e detalhes importantes da peça..." 
            multiline
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* CORREÇÃO DO CLIQUE: Chamando a função diretamente sem misturar nomes */}
        <TouchableOpacity style={styles.publishBtn} onPress={executarCadastro} activeOpacity={0.8}>
          <Text style={styles.publishBtnText}>+ Injetar Produto no Catálogo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  dashboardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 13, color: '#707070', marginBottom: 20 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginBottom: 6 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 10, paddingHorizontal: 14, height: 48, fontSize: 14, color: '#1A1A1A' },
  publishBtn: { backgroundColor: '#0052FF', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  publishBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }
});

