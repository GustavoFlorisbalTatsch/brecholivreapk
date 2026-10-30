import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

// Banco de dados simulado (Mock) conforme as diretrizes do Módulo de Produtos
const PRODUTOS_MOCK = [
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
    status: 'RESERVADO', // Demonstração de bloqueio temporário TTL
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
    description: 'Calça de alfaiataria com corte reto e caimento estruturado elegante. Ideal para ambientes de trabalho ou eventos formais. Sem fios puxados ou marcas de uso.'
  }
];

export default function ProdutosScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categorias = ['Todos', 'Casacos', 'Vestidos', 'Camisetas', 'Calças'];

  // Lógica de filtragem em tempo real (Filtros combinados)
  const produtosFiltrados = PRODUTOS_MOCK.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Lógica de Precificação Inteligente (Cálculo de Desconto % OFF)
  const calcularDesconto = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return null;
    const desconto = ((1 - (price / originalPrice)) * 100).toFixed(0);
    return `${desconto}% OFF`;
  };

  return (
    <View style={styles.container}>
      
      {/* 1. BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#707070" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar no catálogo de moda circular..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 2. FILTRO DE CATEGORIAS HORIZONTAL */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryBadge, 
                selectedCategory === item && styles.categoryBadgeActive
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === item && styles.categoryTextActive
              ]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* 3. GRADE DE PRODUTOS COMPLETA COM REDIRECIONAMENTO INTEGRADO */}
      <FlatList
        data={produtosFiltrados}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const badgeDesconto = calcularDesconto(item.price, item.originalPrice);
          
          return (
            /* O CLIQUE DO PASSO 2 ADICIONADO AQUI NO CARD COMPLETO */
            <TouchableOpacity 
              style={styles.card}
              onPress={() => navigation.navigate('ProdutoDetalhes', { product: item })}
              activeOpacity={0.8}
            >
              {/* Container da Imagem */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                
                {/* Badge de Precificação Inteligente */}
                {badgeDesconto && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{badgeDesconto}</Text>
                  </View>
                )}

                {/* Overlay de Item Reservado (Garantia Concorrente) */}
                {item.status === 'RESERVADO' && (
                  <View style={styles.reservedOverlay}>
                    <Text style={styles.reservedText}>RESERVADO (TTL)</Text>
                  </View>
                )}
              </View>

              {/* Informações de Texto do Card */}
              <View style={styles.infoContainer}>
                <Text style={styles.conditionText}>{item.condition} • {item.type}</Text>
                <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                    {item.originalPrice > item.price && (
                      <Text style={styles.originalPrice}>R$ {item.originalPrice.toFixed(2).replace('.', ',')}</Text>
                    )}
                  </View>
                  <View style={styles.actionButton}>
                    <Icon name="arrow-right" size={14} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum desapego encontrado neste filtro.</Text>
          </View>
        }
      />
    </View>
  );
}

// 4. ESTILIZAÇÃO DO COMPONENTE
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 12 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', marginTop: 15, height: 45 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  categoriesContainer: { marginVertical: 15 },
  categoryBadge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 50, backgroundColor: '#F3F4F6', marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  categoryBadgeActive: { backgroundColor: '#E3F2FD', borderColor: '#0052FF' },
  categoryText: { fontSize: 13, color: '#707070', fontWeight: '500' },
  categoryTextActive: { color: '#0052FF', fontWeight: 'bold' },
  row: { justifyContent: 'space-between' },
  card: { width: (width - 36) / 2, backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  imageContainer: { width: '100%', height: 150, backgroundColor: '#F9FAFB', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  discountBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#0052FF', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  discountText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  reservedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  reservedText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  infoContainer: { padding: 12 },
  conditionText: { fontSize: 10, color: '#707070', fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  productTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  originalPrice: { fontSize: 11, color: '#9CA3AF', textDecorationLine: 'line-through', marginTop: 1 },
actionButton: { backgroundColor: '#0052FF', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
emptyContainer: { flex: 1, alignItems: 'center', marginTop: 40 },
emptyText: { color: '#707070', fontSize: 14 }
});