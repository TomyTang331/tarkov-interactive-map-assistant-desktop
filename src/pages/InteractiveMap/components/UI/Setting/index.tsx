import React from 'react';

import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

export interface SettingProps {
  directoryHandler?: string;
  locationScale: boolean;
  onClickEftWatcherPath: () => void;
  onLocationScaleChange: (b: boolean) => void;
}

const Index = (props: SettingProps) => {
  const {
    locationScale,
    directoryHandler,
    onLocationScaleChange,
    onClickEftWatcherPath,
  } = props;

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const handleClickEftWatcherPath = () => {
    onClickEftWatcherPath();
  };

  const handleToggleLocationScale = () => {
    onLocationScaleChange(!locationScale);
  };

  return (
    <div className="im-quicktools-modal-setting" onMouseDown={(e) => e.stopPropagation()}>
      <div className="im-quicktools-modal-setting-title">
        <span>{t('setting.title')}</span>
      </div>
      <div className="im-quicktools-modal-setting-block">
        {self === top && (
          <button
            className="im-quicktools-modal-setting-button"
            style={{ color: !directoryHandler ? '#ffffff' : '#288828' }}
            onClick={handleClickEftWatcherPath}
          >
            {directoryHandler
              ? `${t('setting.realtimeMarker')} ${directoryHandler.split('\\').pop() || directoryHandler}`
              : t('setting.enableMarker')}
          </button>
        )}
        <button
          style={{ color: !locationScale ? '#882828' : '#288828' }}
          className="im-quicktools-modal-setting-button"
          onClick={handleToggleLocationScale}
        >
          {t('setting.markerScale')} ({locationScale ? t('common.enable') : t('common.disable')})
        </button>
      </div>
    </div>
  );
};

Index.displayName = 'Setting';
export default React.memo(Index);
