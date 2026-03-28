import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

interface EFTWatcherProps {
  directoryHandler?: string;
  tarkovGamePathHandler?: FileSystemDirectoryHandle;
  tarkovGamePathFromRust?: string;
  onClickEftWatcherPath: () => void;
  onClickTarkovGamePath: () => void;
}

const Index = (props: EFTWatcherProps) => {
  const {
    directoryHandler,
    tarkovGamePathHandler,
    tarkovGamePathFromRust,
    onClickEftWatcherPath,
    onClickTarkovGamePath,
  } = props;
  const hasTarkovPath = tarkovGamePathHandler || tarkovGamePathFromRust;

  const [show, setShow] = useState(false);

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const handleCloseModal = () => {
    if (!window.showDirectoryPicker) {
      setShow(false);
    }
  };


  useEffect(() => {
    if (directoryHandler && hasTarkovPath) {
      setShow(false);
    }
  }, [directoryHandler, hasTarkovPath]);

  useEffect(() => {
    if (self === top) {
      setShow(true);
    }
  }, []);

  return (
    <div
      className={classNames('im-eftwatcher-modal', {
        active: show,
      })}
      onMouseDown={handleCloseModal}
    >
      <div className="im-eftwatcher" onMouseDown={(e) => e.stopPropagation()}>
        <div className="im-eftwatcher-title">
          <span>{t('eftwatcher.title')}</span>
        </div>
        <div className="im-eftwatcher-content">
          <span>{t('eftwatcher.tips1')}</span>
          <span>{t('eftwatcher.tips2')}</span>
          <span>{t('eftwatcher.tips3')}</span>
          <span style={{ color: '#ffff88' }}>{t('eftwatcher.tips4')}</span>
          <span style={{ color: '#ffff88' }}>{t('eftwatcher.tips5')}</span>
        </div>
        <div className="im-eftwatcher-buttons">
          {window.showDirectoryPicker ? (
            <button
              style={{ color: !directoryHandler ? '#ffffff' : '#288828' }}
              className="button button-default"
              onClick={onClickEftWatcherPath}
            >
              {directoryHandler ? t('eftwatcher.disableScrPath') : t('eftwatcher.enableScrPath')}
            </button>
          ) : (
            <button className="button button-default">{t('eftwatcher.unsupport')}</button>
          )}
          {(window.showDirectoryPicker || (window as any).__TAURI__) && (
            <button
              style={{ marginTop: 16, color: !hasTarkovPath ? '#ffffff' : '#288828' }}
              className="button button-default"
              onClick={onClickTarkovGamePath}
            >
              {hasTarkovPath
                ? t('eftwatcher.disableGamePath')
                : t('eftwatcher.enableGamePath')}
            </button>
          )}
          <button
            style={{ marginTop: 16 }}
            className="button button-default"
            onClick={() => setShow(false)}
          >
            {t('eftwatcher.later')}
          </button>
        </div>
        <div className="im-eftwatcher-contacts">
          <span>{t('contact.group')}</span>
          <span>{t('contact.email')}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
