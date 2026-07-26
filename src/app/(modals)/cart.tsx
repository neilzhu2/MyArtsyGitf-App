import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DesignTokens } from '../../constants/DesignTokens';
import { useStudioStore } from '../../stores/useStudioStore';
import { UserOrder } from '../../types/user';

export default function CartModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cartItems = useStudioStore(state => state.cartItems);
  const removeFromCart = useStudioStore(state => state.removeFromCart);
  const placeMockOrder = useStudioStore(state => state.placeMockOrder);

  const [address, setAddress] = useState('742 Evergreen Terrace, Vancouver, BC V6B 1A1');
  const [placedOrder, setPlacedOrder] = useState<UserOrder | null>(null);

  const topInsetPadding = Math.max(insets.top, 16);

  const subtotal = cartItems.reduce((acc, item) => acc + item.design.priceCad * item.quantity, 0);
  const shipping = subtotal > 0 ? 12 : 0;
  const grandTotal = subtotal + shipping;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      const order = await placeMockOrder(address);
      setPlacedOrder(order);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  // Order Confirmation State View
  if (placedOrder) {
    return (
      <View style={[styles.outerWrapper, { paddingTop: topInsetPadding }]}>
        <View style={styles.confirmationContainer}>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={56} color="#4E8765" />
          </View>

          <Text style={styles.confirmTitle}>Mock Order Placed!</Text>
          <Text style={styles.confirmSub}>Order Number: {placedOrder.orderNumber}</Text>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Shipping Address:</Text>
            <Text style={styles.summaryValue}>{placedOrder.shippingAddress}</Text>

            <Text style={[styles.summaryLabel, { marginTop: 10 }]}>Total Paid (Mock):</Text>
            <Text style={styles.summaryValue}>CAD ${placedOrder.totalCad}</Text>

            <Text style={[styles.summaryLabel, { marginTop: 10 }]}>Estimated Delivery:</Text>
            <Text style={styles.summaryValue}>3–5 Business Days (Licensed Printing)</Text>
          </View>

          <TouchableOpacity 
            style={styles.confirmBtn}
            onPress={() => {
              router.back();
              router.push('/(tabs)/studio');
            }}
          >
            <Text style={styles.confirmBtnText}>View Order in My Studio →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerWrapper}>
      {/* Header Bar - Clears iOS Status Bar & Dynamic Island */}
      <View style={[styles.headerBar, { paddingTop: topInsetPadding + 6 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#141414" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartBox}>
            <Ionicons name="bag-handle-outline" size={48} color="#9E988F" />
            <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
            <Text style={styles.emptyDesc}>Explore our Gallery or Gift Shop to customize your first physical art gift.</Text>
            <TouchableOpacity 
              style={styles.emptyBtn} 
              onPress={() => { router.back(); router.push('/(tabs)/gallery'); }}
            >
              <Text style={styles.emptyBtnText}>Explore Gallery →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cartContent}>
            {/* Cart Items List */}
            {cartItems.map((item, idx) => (
              <View key={idx} style={styles.cartItemCard}>
                <Image source={{ uri: item.design.previewUrl }} style={styles.itemThumb} contentFit="cover" />
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.design.title}</Text>
                  <Text style={styles.itemMeta}>Color: {item.design.selectedColor.name}</Text>
                  <Text style={styles.itemPrice}>CAD ${item.design.priceCad} × {item.quantity}</Text>
                </View>

                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.design.id)}>
                  <Ionicons name="trash-outline" size={18} color="#C53B3B" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Shipping Address Section */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Shipping Address (Demo)</Text>
              <TextInput 
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter shipping address"
              />
            </View>

            {/* Order Summary Section */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Subtotal</Text>
                <Text style={styles.summaryValueText}>CAD ${subtotal}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Estimated Shipping</Text>
                <Text style={styles.summaryValueText}>CAD ${shipping}</Text>
              </View>

              <View style={[styles.summaryRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalText}>Total</Text>
                <Text style={styles.grandTotalValueText}>CAD ${grandTotal}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={[styles.checkoutBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
            <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
            <Text style={styles.checkoutBtnText}>Place Mock Order (${grandTotal})</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: DesignTokens.colors.canvas,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingBottom: DesignTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignTokens.colors.cardBorder,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141414',
  },
  container: {
    flex: 1,
  },
  emptyCartBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#141414',
  },
  emptyDesc: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 12,
    backgroundColor: '#141414',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: DesignTokens.radius.md,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cartContent: {
    padding: DesignTokens.spacing.lg,
    gap: 16,
    paddingBottom: 40,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DesignTokens.colors.paper,
    borderRadius: DesignTokens.radius.md,
    padding: DesignTokens.spacing.sm,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 12,
  },
  itemThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#141414',
  },
  itemMeta: {
    fontSize: 11,
    color: DesignTokens.colors.text.muted,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: DesignTokens.colors.accent.bronze,
  },
  removeBtn: {
    padding: 8,
  },
  sectionBox: {
    backgroundColor: DesignTokens.colors.paper,
    padding: DesignTokens.spacing.md,
    borderRadius: DesignTokens.radius.md,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#141414',
  },
  input: {
    backgroundColor: DesignTokens.colors.canvas,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    borderRadius: DesignTokens.radius.sm,
    padding: 10,
    fontSize: 13,
    color: '#141414',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  summaryText: {
    fontSize: 13,
    color: DesignTokens.colors.text.secondary,
  },
  summaryValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#141414',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.cardBorder,
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141414',
  },
  grandTotalValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#141414',
  },
  checkoutBar: {
    paddingHorizontal: DesignTokens.spacing.lg,
    paddingTop: DesignTokens.spacing.md,
    backgroundColor: '#FAF8F5',
    borderTopWidth: 1,
    borderTopColor: DesignTokens.colors.cardBorder,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    paddingVertical: 14,
    borderRadius: DesignTokens.radius.md,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Confirmation view styles
  confirmationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DesignTokens.spacing.lg,
    gap: 12,
  },
  successBadge: {
    marginBottom: 8,
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#141414',
  },
  confirmSub: {
    fontSize: 14,
    color: DesignTokens.colors.accent.bronze,
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: DesignTokens.colors.paper,
    padding: DesignTokens.spacing.lg,
    borderRadius: DesignTokens.radius.lg,
    borderWidth: 1,
    borderColor: DesignTokens.colors.cardBorder,
    width: '100%',
    marginVertical: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: DesignTokens.colors.text.muted,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#141414',
    marginTop: 2,
  },
  confirmBtn: {
    backgroundColor: '#141414',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: DesignTokens.radius.md,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
