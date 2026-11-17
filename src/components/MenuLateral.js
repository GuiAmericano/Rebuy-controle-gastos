import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Marca from './Marca';
import { cores, fonte } from '../theme';

export default function MenuLateral({ usuario, sair, ...props }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.tela}>
      <DrawerContentScrollView {...props} style={styles.scroll} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={[styles.cabecalho, { paddingTop: insets.top + 22 }]}>
          <Marca tamanho={48} comNome />

          <View style={styles.usuarioLinha}>
            <Text style={styles.nome} numberOfLines={1}>{usuario.nome}</Text>
            <Text style={styles.email} numberOfLines={1}>{usuario.email}</Text>
          </View>
        </View>

        <View style={{ paddingTop: 8 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.sair} onPress={sair} accessibilityLabel="Sair">
          <Ionicons name="log-out-outline" size={18} color={cores.despesa} />
          <Text style={styles.sairTexto}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  scroll: { backgroundColor: cores.fundo },
  cabecalho: { paddingHorizontal: 20, paddingBottom: 18 },
  usuarioLinha: { marginTop: 22 },
  nome: { ...fonte, color: cores.texto, fontSize: 15, fontWeight: '700' },
  email: { ...fonte, color: cores.textoSuave, fontSize: 12, marginTop: 2 },
  rodape: { borderTopWidth: 1, borderTopColor: cores.borda, paddingTop: 14, paddingHorizontal: 16 },
  sair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: cores.despesaFundo,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.22)',
  },
  sairTexto: { ...fonte, color: cores.despesa, fontWeight: '800', marginLeft: 8, letterSpacing: 0.6, textTransform: 'uppercase', fontSize: 12 },
});
