export const getErrorMessage = (
  error: string,
  t: (key: string) => string
): string => {
  // Tentar traduzir diretamente usando a chave do erro
  try {
    // Primeiro tenta a chave completa do erro
    const translated = t(error);
    if (translated !== error) {
      return translated;
    }

    // Se não encontrou nenhuma tradução específica, usa genérico
    return t("auth.login.genericError");
  } catch {
    return t("auth.login.genericError");
  }
};
