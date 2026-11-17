import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, fonte, olho, semContorno } from '../theme';

export default function CampoSenha({ rotulo, value, onChangeText, placeholder = '••••••' }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={{ marginTop: 14 }}>
      {rotulo && <Text style={styles.rotulo}>{rotulo}</Text>}
      <View style={styles.caixa}>
        <Ionicons name="lock-closed-outline" size={18} color={cores.textoClaro} style={{ marginLeft: 14 }} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={cores.textoClaro}
          secureTextEntry={!visivel}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.olhoBotao}
          onPress={() => setVisivel((v) => !v)}
          accessibilityLabel={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <Ionicons name={visivel ? 'eye-off-outline' : 'eye-outline'} size={20} color={cores.textoSuave} />
        </TouchableOpacity>
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
  olhoBotao: { paddingHorizontal: 14, paddingVertical: 12 },
});
