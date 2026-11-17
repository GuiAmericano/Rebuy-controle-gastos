import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Marca from '../components/Marca';
import { cores, fonte, moldura, olho } from '../theme';

const PASSOS = [
  'Crie um projeto em console.firebase.google.com.',
  'Em Authentication, ative o provedor E-mail/senha.',
  'Crie um banco Cloud Firestore.',
  'Em Regras, cole o conteúdo do arquivo firestore.rules e publique.',
  'Em Configurações do projeto, adicione um app Web e copie as credenciais para src/firebaseConfig.js, no lugar de COLE_AQUI.',
];

export default function ConfigFirebaseScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
    >
      <View style={styles.miolo}>
        <Marca tamanho={64} comNome />
        <Text style={[olho, { marginTop: 22 }]}>Configuração</Text>
        <Text style={styles.titulo}>Falta conectar o Firebase</Text>
        <Text style={styles.texto}>
          O app já está pronto para gravar contas, lançamentos, categorias e metas. Cole as credenciais do seu projeto para ele passar a salvar de verdade.
        </Text>

        <View style={styles.cartao}>
          {PASSOS.map((passo, indice) => (
            <View key={passo} style={styles.passo}>
              <View style={styles.numero}>
                <Text style={styles.numeroTexto}>{indice + 1}</Text>
              </View>
              <Text style={styles.passoTexto}>{passo}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.rodape}>O passo a passo completo está no README.md.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  container: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 },
  miolo: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  titulo: { ...fonte, fontSize: 32, lineHeight: 36, fontWeight: '800', color: cores.texto, letterSpacing: -0.8, marginTop: 8 },
  texto: { ...fonte, fontSize: 15, color: cores.textoSuave, marginTop: 12, lineHeight: 22 },
  cartao: { ...moldura, padding: 18, marginTop: 22 },
  passo: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: cores.lima,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numeroTexto: { ...fonte, color: cores.tinta, fontWeight: '800' },
  passoTexto: { ...fonte, flex: 1, fontSize: 14, color: cores.texto, lineHeight: 20 },
  rodape: { ...fonte, textAlign: 'center', color: cores.textoClaro, marginTop: 16, fontSize: 13 },
});
