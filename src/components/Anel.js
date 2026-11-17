import { View, StyleSheet } from 'react-native';
import { cores } from '../theme';

const FATIAS = 28;

export default function Anel({ progresso = 0, tamanho = 76, cor = cores.lima, children }) {
  const ativos = Math.round(Math.max(0, Math.min(1, progresso)) * FATIAS);
  const raio = tamanho / 2 - 8;

  return (
    <View style={{ width: tamanho, height: tamanho, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: FATIAS }, (_, i) => {
        const ang = (i / FATIAS) * Math.PI * 2 - Math.PI / 2;
        const ligado = i < ativos;
        const comp = ligado ? 9 : 5;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: 3,
              height: comp,
              borderRadius: 2,
              backgroundColor: ligado ? cor : 'rgba(255,255,255,0.14)',
              left: tamanho / 2 + Math.cos(ang) * raio - 1.5,
              top: tamanho / 2 + Math.sin(ang) * raio - comp / 2,
              transform: [{ rotate: `${(i / FATIAS) * 360}deg` }],
            }}
          />
        );
      })}
      <View style={styles.centro}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { alignItems: 'center', justifyContent: 'center' },
});
