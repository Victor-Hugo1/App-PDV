import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Venda from './components/Venda';
import Encomenda from './components/Encomenda';

const COLORS = {
  bg: '#FFF8F5',
  surface: '#FFFFFF',
  ink: '#2D211B',
  muted: '#7D6F67',
  brown: '#964319',
  brownDark: '#6F2F12',
  peach: '#FCE6D8',
  line: '#EADDD5',
  green: '#2F7D4A',
  red: '#B83A2D',
};

export default function App() {
  const [tela, setTela] = useState('venda');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {tela === 'venda' && <Venda onNavigate={setTela} />}
      {tela === 'encomendas' && <Encomenda onNavigate={setTela} />}
      {tela === 'inicio' && <Inicio onNavigate={setTela} />}
      {tela === 'finalizacao' && <Finalizacao onNavigate={setTela} />}

      <View style={styles.tabBar}>
        <Tab icon="⌂" label="PDV" active={tela === 'venda'} onPress={() => setTela('venda')} />
        <Tab icon="▣" label="Encomendas" active={tela === 'encomendas'} onPress={() => setTela('encomendas')} />
        <Tab icon="☰" label="Menu" active={tela === 'inicio'} onPress={() => setTela('inicio')} />
      </View>
    </View>
  );
}

function Tab({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text style={[styles.tabIcon, active && styles.tabActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Inicio({ onNavigate }) {
  return (
    <ScrollView contentContainerStyle={styles.menuPage}>
      <View style={styles.logoRow}>
        <Text style={styles.logo}>Fornada</Text>
        <View style={styles.avatar}><Text style={styles.avatarText}>V</Text></View>
      </View>
      <Text style={styles.menuTitle}>Olá, caixa! 👋</Text>
      <Text style={styles.menuSubtitle}>Escolha uma operação para continuar.</Text>

      <TouchableOpacity style={styles.menuCard} onPress={() => onNavigate('venda')}>
        <View style={styles.menuIcon}><Text>🛒</Text></View>
        <View style={styles.flex}><Text style={styles.menuCardTitle}>Venda de balcão</Text><Text style={styles.menuCardText}>Produtos, Xepa e pagamento.</Text></View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuCard} onPress={() => onNavigate('encomendas')}>
        <View style={styles.menuIcon}><Text>📋</Text></View>
        <View style={styles.flex}><Text style={styles.menuCardTitle}>Gestão de encomendas</Text><Text style={styles.menuCardText}>Acompanhe pedidos e capacidade.</Text></View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Finalizacao({ onNavigate }) {
  return (
    <View style={styles.finalPage}>
      <View style={styles.successCircle}><Text style={styles.successIcon}>✓</Text></View>
      <Text style={styles.finalTitle}>Venda finalizada!</Text>
      <Text style={styles.finalText}>Pagamento aprovado e estoque atualizado.</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>TOTAL</Text>
        <Text style={styles.summaryValue}>R$ 24,50</Text>
        <View style={styles.divider} />
        <View style={styles.rowBetween}><Text style={styles.muted}>Recebido</Text><Text>R$ 30,00</Text></View>
        <View style={styles.rowBetween}><Text style={styles.muted}>Troco</Text><Text style={styles.change}>R$ 5,50</Text></View>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => onNavigate('venda')}><Text style={styles.primaryText}>Nova venda</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  tabBar: { height: 74, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.line, flexDirection: 'row', paddingBottom: 8 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 20, color: COLORS.muted, marginBottom: 3 },
  tabLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '600' },
  tabActive: { color: COLORS.brown },
  menuPage: { padding: 20, paddingTop: 58, paddingBottom: 100 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 26, fontWeight: '800', color: COLORS.brown },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.peach, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.brown, fontWeight: '800' },
  menuTitle: { fontSize: 28, fontWeight: '800', color: COLORS.ink, marginTop: 32 },
  menuSubtitle: { fontSize: 15, color: COLORS.muted, marginTop: 6, marginBottom: 22 },
  menuCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  menuIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: COLORS.peach, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  flex: { flex: 1 },
  menuCardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.ink },
  menuCardText: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  arrow: { fontSize: 28, color: COLORS.muted },
  finalPage: { flex: 1, padding: 24, paddingTop: 90, alignItems: 'center' },
  successCircle: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#DDF2E3', alignItems: 'center', justifyContent: 'center' },
  successIcon: { fontSize: 40, color: COLORS.green, fontWeight: '700' },
  finalTitle: { fontSize: 28, fontWeight: '800', color: COLORS.ink, marginTop: 20 },
  finalText: { fontSize: 15, color: COLORS.muted, textAlign: 'center', marginTop: 8 },
  summaryCard: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 18, padding: 20, marginTop: 28, borderWidth: 1, borderColor: COLORS.line },
  summaryLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '800', letterSpacing: 1 },
  summaryValue: { fontSize: 32, fontWeight: '800', color: COLORS.brown, marginTop: 6 },
  divider: { height: 1, backgroundColor: COLORS.line, marginVertical: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  muted: { color: COLORS.muted },
  change: { color: COLORS.green, fontWeight: '800' },
  primaryButton: { width: '100%', height: 52, backgroundColor: COLORS.brown, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
