import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Marca from './Marca';
import { cores, fonte, fonteSerif, sombra } from '../theme';

export default function AuthLayout({ selo, titulo, destaque, subtitulo, pontos, children }) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.blob} />
      <View style={styles.blob2} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 28 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.miolo}>
          <Marca tamanho={58} comNome />

          {selo ? (
            <View style={styles.selo}>
              <View style={styles.seloPonto} />
              <Text style={styles.seloTexto}>{selo}</Text>
            </View>
          ) : null}

          <Text style={styles.titulo}>
            {titulo}
            {destaque ? '\n' : ''}
            {destaque ? <Text style={styles.destaque}>{destaque}</Text> : null}
          </Text>
          {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}

          {pontos?.length ? (
            <View style={styles.pontos}>
              {pontos.map((ponto) => (
                <View key={ponto} style={styles.pontoItem}>
                  <Ionicons name="checkmark-circle" size={14} color={cores.lima} />
                  <Text style={styles.pontoTexto}>{ponto}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.cartao}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, overflow: 'hidden' },
  blob: {
    position: 'absolute',
    width: 460,
    height: 460,
    borderRadius: 230,
    backgroundColor: 'rgba(198,245,74,0.09)',
    top: -180,
    right: -140,
  },
  blob2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(198,245,74,0.05)',
    bottom: -90,
    left: -110,
  },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  miolo: { width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 24 },
  selo: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.limaBorda,
    backgroundColor: cores.limaSuave,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 32,
  },
  seloPonto: { width: 6, height: 6, borderRadius: 3, backgroundColor: cores.lima, marginRight: 8 },
  seloTexto: { ...fonte, color: cores.lima, fontSize: 12, fontWeight: '700' },
  titulo: {
    ...fonte,
    color: cores.texto,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: '800',
    letterSpacing: -1.2,
    marginTop: 18,
  },
  destaque: {
    ...fonteSerif,
    fontStyle: 'italic',
    fontWeight: '400',
    color: cores.lima,
    letterSpacing: -0.6,
  },
  subtitulo: { ...fonte, color: cores.textoSuave, fontSize: 16, lineHeight: 24, marginTop: 14 },
  pontos: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  pontoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 6 },
  pontoTexto: { ...fonte, color: cores.textoSuave, fontSize: 13, marginLeft: 6 },
  cartao: {
    backgroundColor: cores.cartao,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(198,245,74,0.16)',
    padding: 22,
    marginTop: 26,
    ...sombra,
  },
});
