import { useCallback, useMemo } from 'react';

import i18n_zh from './zh';

export type LangCode = 'zh';

const useI18N = (lang: string) => {
  const i18n = useMemo(() => {
    return i18n_zh;
  }, [lang]);

  const getTranslation = (obj: Record<string, unknown>, path: string[]): string | undefined => {
    const result = path.reduce<unknown>((acc, key) => (acc as Record<string, unknown>)?.[key], obj);
    return typeof result === 'string' ? result : undefined;
  };

  const t = useCallback((identify: string) => {
    const identifies = identify.split('.');
    return getTranslation(i18n, identifies) || identify;
  }, [i18n]);

  return { t };
};

export default useI18N;
