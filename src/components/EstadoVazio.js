import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte } from '../theme';

export default function EstadoVazio({ icone, titulo, texto, children }) {
  return (
    <View style={styles.caixa}>
      <View style={styles.circulo}>
        <Ionicons name={icone} size={32} color={cores.lima} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      {texto ? <Text style={styles.texto}>{texto}</Text> : null}
      {children ? <View style={styles.acoes}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { alignItems: 'center', padding: 28 },
  circulo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: cores.limaSuave,
    borderWidth: 1,
    borderColor: cores.limaBorda,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: { ...fonte, fontSize: 20, fontWeight: '800', color: cores.texto, textAlign: 'center', letterSpacing: -0.3 },
  texto: { ...fonte, fontSize: 15, color: cores.textoSuave, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  acoes: { marginTop: 22, alignSelf: 'stretch' },
});
