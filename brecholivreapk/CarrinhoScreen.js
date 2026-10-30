import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

export default function CarrinhoScreen() {
  // Estado inicial simulando itens adicionados do brechó
  const [cartItems, setCartItems] = useState([
    { id: '1', title: 'Jaqueta Jeans Anos 90', price: 120.00, image: 'https://unsplash.com', quantidade: 1 },
    { id: '3', title: 'Camiseta Básica Algodão Orgânico', price: 45.00, image: 'https://unsplash.com', quantidade: 2 }
  ]);

  // Função para alterar quantidade (+ ou -)
  const alterarQuantidade = (id, tipo) => {
    const novosItens = cartItems.map(item => {
      if (item.id === id) {
        const novaQtd = tipo === 'somar' ? item.quantidade + 1 : item.quantidade - 1;
        return { ...item, quantidade: novaQtd < 1 ? 1 : novaQtd };
      }
      return item;
    });
    setCartItems(novosItens);
  };

  // Função para deletar produto do carrinho
  const removerProduto = (id) => {
    const itensFiltrados = cartItems.filter(item => item.id !== id);
    setCartItems(itensFiltrados);
  };

  const calcularTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantidade), 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
              
              {/* Controles de Quantidade Estilizados e Robustos */}
              <View style={styles.controlRow}>
                <TouchableOpacity 
                  style={styles.counterBtn} 
                  onPress={() => alterarQuantidade(item.id, 'subtrair')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                
                <View style={styles.qtyDisplay}>
                  <Text style={styles.qtyText}>{item.quantidade}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.counterBtn} 
                  onPress={() => alterarQuantidade(item.id, 'somar')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão de Deletar Visível e Clicável (Com Cor de Alerta) */}
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => removerProduto(item.id)}
              activeOpacity={0.6}
            >
              <Text style={styles.deleteIconText}>🗑</Text>
              <Text style={styles.deleteLabelText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍</Text>
            <Text style={styles.emptyText}>Seu carrinho está vazio.</Text>
          </View>
        }
      />

      {/* Resumo de Fechamento Base Inferior */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {calcularTotal().replace('.', ',')}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}>
            <Text style={styles.checkoutBtnText}>Fechar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  itemCard: { 
    flexDirection: 'row', 
    backgroundColor: '#F9FAFB', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 15, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F3F4F6' },
  itemInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  itemPrice: { fontSize: 15, color: '#0052FF', fontWeight: '800', marginVertical: 6 },
  controlRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  counterBtn: { 
    width: 32, 
    height: 32, 
    backgroundColor: '#0052FF', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  counterBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20
  },
  qtyDisplay: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyText: { fontSize: 15, fontWeight: 'bold', color: '#1A1A1A' },
  deleteBtn: { 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  deleteIconText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 2
  },
  deleteLabelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EF4444',
    textTransform: 'uppercase'
  },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 45, marginBottom: 10 },
  emptyText: { color: '#707070', fontSize: 16, fontWeight: '500' },
  footer: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: '#E5E7EB', 
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: '#707070', fontWeight: '500' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#1A1A1A' },
  checkoutBtn: { backgroundColor: '#0052FF', height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
});
