import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte, brilho } from '../theme';

export default function Fab({ onPress }) {
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: insets.bottom + 20 }]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityLabel="Novo lançamento"
    >
      <Ionicons name="add" size={20} color={cores.tinta} />
      <Text style={styles.texto}>Novo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.lima,
    borderRadius: 999,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 18,
    ...brilho,
  },
  texto: { ...fonte, color: cores.tinta, fontWeight: '800', fontSize: 15, marginLeft: 4 },
});
