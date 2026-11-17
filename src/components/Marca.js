import { View, Text, Image, Platform } from 'react-native';
import { cores, fonte } from '../theme';

export const nomeDoApp = 'Rebuy';

const ficha = require('../../assets/simbolo.png');

export default function Marca({ tamanho = 44, comNome = false }) {
  const simbolo = (
    <Image
      source={ficha}
      resizeMode="contain"
      accessibilityLabel="Rebuy"
      style={{
        width: tamanho,
        height: tamanho,
        ...Platform.select({
          web: { boxShadow: '0 0 18px rgba(198,245,74,0.22)' },
          default: {},
        }),
      }}
    />
  );

  if (!comNome) return simbolo;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {simbolo}
      <Text
        style={{
          ...fonte,
          color: cores.texto,
          fontSize: Math.round(tamanho * 0.4),
          fontWeight: '800',
          letterSpacing: -0.4,
          marginLeft: Math.round(tamanho * 0.28),
        }}
      >
        {nomeDoApp}
      </Text>
    </View>
  );
}
