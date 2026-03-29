import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const translateExerciseName = (name: string) => {
    const withPrefix = name.startsWith("exercises.")
      ? name
      : `exercises.${name}`;
    const translatedWithPrefix = t(withPrefix);
    if (translatedWithPrefix !== withPrefix) return translatedWithPrefix;
    const translatedAsIs = t(name);
    if (translatedAsIs !== name) return translatedAsIs;
    return name;
  };

  return {
    t,
    translateExerciseName,
    changeLanguage,
    getCurrentLanguage,
    language: i18n.language,
  };
};
