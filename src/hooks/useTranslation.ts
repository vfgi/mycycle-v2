import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };
  
  const getCurrentLanguage = () => {
    return i18n.language;
  };
  
  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    language: i18n.language,
  };
};
