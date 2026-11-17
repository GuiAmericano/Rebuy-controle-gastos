import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte, olho, semContorno } from '../theme';

export default function Campo({ rotulo, icone, style, ...props }) {
  return (
    <View style={[{ marginTop: 14 }, style]}>
      {rotulo && <Text style={styles.rotulo}>{rotulo}</Text>}
      <View style={styles.caixa}>
        {icone && <Ionicons name={icone} size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />}
        <TextInput style={styles.input} placeholderTextColor={cores.textoClaro} {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { ...olho, marginBottom: 8 },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    backgroundColor: cores.fundoElevado,
  },
  input: {
    ...fonte,
    ...semContorno,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 13,
    fontSize: 16,
    color: cores.texto,
  },
});
