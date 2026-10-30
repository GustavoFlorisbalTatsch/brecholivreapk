import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProdutoDetalhesScreen({ route, navigation }) {
  const { product } = route.params;
  const [activeTab, setActiveTab] = useState('descricao');

  // Fallbacks de segurança para dados opcionais ou fixos
  const vendedorNome = product.vendedor || 'Leo Passaro Brechó';
  const ratingText = product.rating || '4.9';
  const reviewsText = product.reviews || '32 avaliações';

  // Formata o preço se ele vier como número puro da documentação técnica
  const precoFormatado = typeof product.price === 'number' 
    ? `R$ ${product.price.toFixed(2).replace('.', ',')}` 
    : product.price;

  // AÇÃO 1: Adicionar o produto ao Carrinho
  const handleAdicionarAoCarrinho = () => {
    Alert.alert(
      "Carrinho Atualizado",
      `${product.title} foi adicionado ao seu carrinho com sucesso!`
    );
  };

  // AÇÃO 2: Comprar agora e ir direto para o Carrinho
  const handleComprarAgora = () => {
    navigation.navigate('Carrinho');
  };

  // AÇÃO 3: Chamar o lojista no Chat
  const handleAbrirChat = () => {
    Alert.alert("Chat", `Iniciando conversa com ${vendedorNome}...`);
  };

  return (
    <View style={styles.container}>
      {/* O ScrollView agora ocupa apenas o espaço de cima, sem engolir os botões */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* Imagem do Produto */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.tagRow}>
            <Text style={styles.categoryTag}>{product.category}</Text>
            <View style={styles.ratingBox}>
              <Text style={styles.starEmoji}>⭐</Text>
              <Text style={styles.ratingText}>{ratingText} ({reviewsText})</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>{precoFormatado}</Text>

          {/* Card do Vendedor */}
          <View style={styles.vendedorCard}>
            <View style={styles.vendedorInfo}>
              <View style={styles.vendedorAvatar}>
                <Text style={styles.avatarText}>{vendedorNome.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.vendedorName}>{vendedorNome}</Text>
                <Text style={styles.vendedorStatus}>Vendedor Verificado</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatButton} onPress={handleAbrirChat}>
              <Text style={styles.chatIcon}>💬</Text>
              <Text style={styles.chatButtonText}>Conversa</Text>
            </TouchableOpacity>
          </View>

          {/* Abas Shopee/Amazon */}
          <View style={styles.tabMenu}>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'descricao' && styles.tabActive]}
              onPress={() => setActiveTab('descricao')}
            >
              <Text style={[styles.tabText, activeTab === 'descricao' && styles.tabTextActive]}>Descrição</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'detalhes' && styles.tabActive]}
              onPress={() => setActiveTab('detalhes')}
            >
              <Text style={[styles.tabText, activeTab === 'detalhes' && styles.tabTextActive]}>Especificações</Text>
            </TouchableOpacity>
          </View>

          {/* Renderização Condicional das Abas */}
          {activeTab === 'descricao' ? (
            <Text style={styles.descriptionText}>
              {product.description || 'Nenhuma descrição detalhada fornecida para este item vintage.'}
            </Text>
          ) : (
            <View style={styles.specsContainer}>
              <Text style={styles.specLine}>• <Text style={styles.bold}>Tipo de Estoque:</Text> {product.type || 'UNIQUE'}</Text>
              <Text style={styles.specLine}>• <Text style={styles.bold}>Condição do Item:</Text> {product.condition || 'Excelente'}</Text>
              {product.medidas?.busto && (
                <Text style={styles.specLine}>• <Text style={styles.bold}>Medida Busto:</Text> {product.medidas.busto}</Text>
              )}
              {product.medidas?.cintura && (
                <Text style={styles.specLine}>• <Text style={styles.bold}>Medida Cintura:</Text> {product.medidas.cintura}</Text>
              )}
              {product.medidas?.quadril && (
                <Text style={styles.specLine}>• <Text style={styles.bold}>Medida Quadril:</Text> {product.medidas.quadril}</Text>
              )}
              {product.medidas?.comprimento && (
                <Text style={styles.specLine}>• <Text style={styles.bold}>Comprimento:</Text> {product.medidas.comprimento}</Text>
              )}
            </View>
          )}

        </View>
      </ScrollView>

      {/* PAINEL INFERIOR FIXO REESTRUTURADO (Fica preso embaixo independente da rolagem) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAdicionarAoCarrinho}
          activeOpacity={0.7}
        >
          <Text style={styles.cartEmoji}>🛒</Text>
          <Text style={styles.addToCartText}>Adicionar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buyNowButton} 
          onPress={handleComprarAgora}
          activeOpacity={0.8}
        >
          <Text style={styles.buyNowText}>Comprar Agora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    position: 'relative' // Garante que elementos absolutos se alinhem corretamente
  },
  imageContainer: { width: width, height: 320, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  infoContainer: { padding: 20 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryTag: { backgroundColor: '#E3F2FD', color: '#0052FF', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, fontSize: 12, fontWeight: 'bold' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  starEmoji: { fontSize: 14, marginRight: 4 },
  ratingText: { fontSize: 13, color: '#555555', fontWeight: '500' },
  productTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  productPrice: { fontSize: 26, fontWeight: '800', color: '#0052FF', marginBottom: 20 },
  vendedorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 12, borderRadius: 16, marginBottom: 25 },
  vendedorInfo: { flexDirection: 'row', alignItems: 'center' },
  vendedorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0052FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  vendedorName: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  vendedorStatus: { fontSize: 12, color: '#707070' },
  chatButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  chatIcon: { fontSize: 14, marginRight: 4 },
  chatButtonText: { color: '#0052FF', fontWeight: 'bold', fontSize: 13 },
  tabMenu: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E7EB', marginBottom: 15 },
  tabItem: { paddingBottom: 10, marginRight: 20, borderBottomWidth: 2, borderColor: 'transparent' },
  tabActive: { borderColor: '#0052FF' },
  tabText: { fontSize: 15, color: '#707070', fontWeight: '500' },
  tabTextActive: { color: '#0052FF', fontWeight: 'bold' },
  descriptionText: { fontSize: 15, color: '#4B5563', lineHeight: 22 },
  specsContainer: { paddingVertical: 5 },
  specLine: { fontSize: 15, color: '#4B5563', marginBottom: 8 },
  bold: { fontWeight: 'bold', color: '#1A1A1A' },
  
  // ESTILO CORRIGIDO: Barra inferior agora fica fixa embaixo e visível na Web/Mobile
  bottomBar: { 
    height: 80, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderColor: '#E5E7EB', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    justifyContent: 'space-between'
  },
  addToCartButton: { 
    flex: 1, 
    flexDirection: 'row', 
    height: 50, 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1.5, 
    borderColor: '#0052FF', 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  cartEmoji: { fontSize: 16, marginRight: 6 },
  addToCartText: { color: '#0052FF', fontWeight: 'bold', fontSize: 15 },
  buyNowButton: { 
    flex: 1.5, 
    height: 50, 
    backgroundColor: '#0052FF', 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  buyNowText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 }
});
