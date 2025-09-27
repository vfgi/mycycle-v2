import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import { getLocales } from "react-native-localize";
import ptBR from "../locales/ptBR.json";
import ptPT from "../locales/ptPT.json";
import en from "../locales/en.json";
import es from "../locales/es.json";
import { languageStorage } from "../services/languageStorage";

const resources = {
  "pt-BR": {
    translation: ptBR,
  },
  "pt-PT": {
    translation: ptPT,
  },
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

const getSystemLanguage = (): string => {
  // Fallback para inglês até configurar react-native-localize
  return "en";
};

const initializeLanguage = async (): Promise<string> => {
  try {
    // Primeiro tenta pegar o idioma salvo pelo usuário
    const savedLanguage = await languageStorage.getSelectedLanguage();
    if (savedLanguage) {
      return savedLanguage;
    }

    // Se não há idioma salvo, usa o idioma do sistema
    const systemLanguage = getSystemLanguage();
    return systemLanguage;
  } catch (error) {
    console.error("Error initializing language:", error);
    return "en"; // Fallback para inglês
  }
};

// Inicializar i18n de forma assíncrona
const initI18n = async () => {
  const initialLanguage = await initializeLanguage();

  i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

// Exportar função para mudar idioma
export const changeLanguage = async (languageCode: string) => {
  try {
    await languageStorage.setSelectedLanguage(languageCode);
    await i18n.changeLanguage(languageCode);
  } catch (error) {
    console.error("Error changing language:", error);
  }
};

// Exportar função para obter idioma atual
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Inicializar
initI18n();

export default i18n;
