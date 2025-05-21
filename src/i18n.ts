import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      // Exemplo de tradução, depois será expandido
      'boot.initializing': 'Inicializando sistema...',
      'boot.loadingKernel': 'Carregando módulos do kernel...',
      'boot.memoryError': 'ERRO: Corrupção de memória detectada',
      'boot.recovery': 'Tentando recuperação...',
      'boot.integrityWarning': 'AVISO: Integridade do sistema comprometida',
      'boot.loadingProtocols': 'Carregando protocolos de emergência...',
      'boot.criticalError': 'ERRO: Falha crítica do sistema',
      'boot.emergency': 'Iniciando sequência de boot de emergência...',
      'boot.unauthorized': 'ALERTA: Acesso não autorizado detectado',
      'boot.locked': 'Sistema bloqueado. Pressione CTRL+ALT+DEL para continuar',
      'boot.forceEntry': 'FORÇAR ENTRADA',
      'boot.ctrlAltDel': 'CTRL//ALT//DEL para começar',
      'exploration.description': 'Uma experiência digital imersiva com estética glitch, narrativa não linear e engajamento sensorial.',
      'exploration.enter': 'ENTRAR NA EXPERIÊNCIA',
      // Adicione mais traduções conforme necessário
    }
  },
  'en': {
    translation: {
      'boot.initializing': 'Initializing system...',
      'boot.loadingKernel': 'Loading kernel modules...',
      'boot.memoryError': 'ERROR: Memory corruption detected',
      'boot.recovery': 'Attempting recovery...',
      'boot.integrityWarning': 'WARNING: System integrity compromised',
      'boot.loadingProtocols': 'Loading emergency protocols...',
      'boot.criticalError': 'ERROR: Critical system failure',
      'boot.emergency': 'Initiating emergency boot sequence...',
      'boot.unauthorized': 'ALERT: Unauthorized access detected',
      'boot.locked': 'System locked. Press CTRL+ALT+DEL to continue',
      'boot.forceEntry': 'FORCE ENTRY',
      'boot.ctrlAltDel': 'CTRL//ALT//DEL to begin',
      'exploration.description': 'An immersive digital experience with glitch aesthetics, non-linear storytelling, and sensory engagement.',
      'exploration.enter': 'ENTER EXPERIENCE',
      // Add more translations as needed
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 