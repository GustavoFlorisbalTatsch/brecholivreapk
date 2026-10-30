import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const trendingProducts = [
  {
    id: '1',
    title: 'Jaqueta Jeans Vintage 90s',
    category: 'Casacos',
    price: 120.00,
    originalPrice: 300.00,
    condition: 'Excelente',
    type: 'UNIQUE',
    status: 'ATIVO',
    image: 'https://unsplash.com',
    medidas: { busto: '110cm', comprimento: '65cm' },
    vendedor: 'Leo Passaro Brechó',
    rating: '4.9',
    reviews: '32 avaliações',
    description: 'Jaqueta Jeans clássica dos anos 90 em perfeito estado. Tecido robusto e lavagem estonada autêntica de época. Perfeita para looks vintage streetwear.'
  },
  {
    id: '2',
    title: 'Vestido Floral Boho',
    category: 'Vestidos',
    price: 85.00,
    originalPrice: 190.00,
    condition: 'Novo com Etiqueta',
    type: 'UNIQUE',
    status: 'RESERVADO',
    image: 'https://unsplash.com',
    medidas: { cintura: '74cm', quadril: '98cm' },
    vendedor: 'Aninha Desapegos',
    rating: '5.0',
    reviews: '12 avaliações',
    description: 'Vestido estilo boho chic com estampa floral delicada. Nunca usado, ainda com a etiqueta original de fábrica. Tecido leve e fluido.'
  },
  {
    id: '3',
    title: 'Camiseta Básica Algodão Orgânico',
    category: 'Camisetas',
    price: 45.00,
    originalPrice: 50.00,
    condition: 'Bom com Detalhes',
    type: 'STANDARD',
    status: 'ATIVO',
    image: 'https://unsplash.com',
    medidas: { busto: '95cm', comprimento: '70cm' },
    vendedor: 'Bio Estética',
    rating: '4.8',
    reviews: '25 avaliações',
    description: 'Camiseta confeccionada em algodão 100% orgânico sustentável. Possui uma pequena marca de lavagem quase imperceptível perto da barra inferior.'
  },
  {
    id: '4',
    title: 'Calça Alfaiataria Preta',
    category: 'Calças',
    price: 110.00,
    originalPrice: 280.00,
    condition: 'Excelente',
    type: 'UNIQUE',
    status: 'ATIVO',
    image: 'https://unsplash.com',
    medidas: { cintura: '80cm', quadril: '104cm' },
    vendedor: 'Guga Tech Store',
    rating: '4.7',
    reviews: '18 avaliações',
    description: 'Calça de alfaiataria com corte resto e caimento estruturado elegante. Ideal para ambientes de trabalho ou eventos formais. Sem fios puxados ou marcas de uso.'
  },
];

export default function HomeScreen({ navigation }) {
  const calcularDesconto = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return null;
    const desconto = ((1 - (price / originalPrice)) * 100).toFixed(0);
    return `${desconto}% OFF`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 1. HEADER DA LOGO (Com legendas de texto para Login e Carrinho) */}
      <View style={styles.header}>
        <Text style={styles.logoText}>BRECHÓ <Text style={styles.logoSub}>LIVRE</Text></Text>
        <View style={styles.headerActions}>
          
          {/* Esquerda: Login */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.navBlock}>
            <Icon name="user" size={20} color="#1A1A1A" />
            <Text style={styles.navLabel}>Login</Text>
          </TouchableOpacity>

          {/* Direita: Carrinho */}
          <TouchableOpacity onPress={() => navigation.navigate('Carrinho')} style={styles.navBlock}>
            <Icon name="shopping-cart" size={20} color="#0052FF" />
            <Text style={[styles.navLabel, { color: '#0052FF' }]}>Carrinho</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* 2. BANNER PRINCIPAL */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerSubtitle}>BRECHÓ LIVRE</Text>
          <Text style={styles.bannerTitle}>
            Reutilizar é a{'\n'}
            <Text style={styles.bannerTitleBlue}>Nova Tendência:</Text>{'\n'}
            Estilo Consciente{'\n'}e Sem Desperdício
          </Text>
          <Text style={styles.bannerDescription}>
            Dê uma nova vida a roupas e itens e ajude a preservar o meio ambiente. Explore nosso brechó sustentável.
          </Text>
          
          <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate('ProdutosTab')}>
            <Text style={styles.bannerButtonText}>Explorar Agora</Text>
          </TouchableOpacity>
        </View>

        <Image 
          source={{ uri: 'https://unsplash.com' }} 
          style={styles.bannerImage}
        />
      </View>

      {/* 3. SEÇÃO TRENDING PRODUCTS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProdutosTab')}>
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* Grid de Produtos */}
      <View style={styles.productsGrid}>
        {trendingProducts.map((product) => {
          const badgeDesconto = calcularDesconto(product.price, product.originalPrice);

          return (
            <TouchableOpacity 
              key={product.id} 
              style={styles.productCard}
              onPress={() => navigation.navigate('ProdutoDetalhes', { product: product })}
              activeOpacity={0.8}
            >
              <View style={[styles.productImageContainer, { backgroundColor: '#F9FAFB' }]}>
                <View style={styles.badgeCategory}>
                  <Text style={styles.badgeText}>{product.category}</Text>
                </View>
                
                <Image source={{ uri: product.image }} style={styles.productImage} />
                
                {badgeDesconto && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{badgeDesconto}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
              
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                <View style={styles.cartButton}>
                  <Icon name="shopping-cart" size={14} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  logoText: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', letterSpacing: 1 },
  logoSub: { color: '#707070', fontWeight: '400' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  navBlock: { alignItems: 'center', justifyContent: 'center', marginLeft: 16 },
  navLabel: { fontSize: 10, fontWeight: '600', color: '#1A1A1A', marginTop: 2 },
  bannerContainer: { margin: 20, backgroundColor: '#F3F4F6', borderRadius: 24, padding: 20 },
  bannerContent: { width: '100%', marginBottom: 15 },
  bannerSubtitle: { fontSize: 12, fontWeight: 'bold', color: '#707070', marginBottom: 5 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', lineHeight: 28 },
  bannerTitleBlue: { color: '#0052FF' },
  bannerDescription: { fontSize: 13, color: '#555555', marginTop: 10, lineHeight: 18 },
  bannerButton: { backgroundColor: '#0052FF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 50, alignSelf: 'flex-start', marginTop: 15 },
  bannerButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  bannerImage: { width: '100%', height: 180, borderRadius: 16, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  viewAllText: { fontSize: 14, color: '#0052FF', fontWeight: '600' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  productCard: { width: (width - 40) / 2, backgroundColor: '#FFFFFF', marginBottom: 20, paddingHorizontal: 8 },
  productImageContainer: { width: '100%', height: 160, borderRadius: 16, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgeCategory: { position: 'absolute', top: 10, left: 10, backgroundColor: '#FFFFFF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, zIndex: 1, elevation: 1 },
  badgeText: { fontSize: 10, color: '#707070', fontWeight: 'bold' },
  discountBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: '#0052FF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, zIndex: 1 },
  discountText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  productTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginTop: 8 },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
productPrice: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A' },
cartButton: { backgroundColor: '#0052FF', padding: 8, borderRadius: 50 },
});