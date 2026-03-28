import React, { useEffect, useMemo, useState } from 'react';

import { useInterval } from 'ahooks';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

interface MapInfoProps {
  mapData: InteractiveMap.Data;
  raidInfo?: InteractiveMap.RaidLogProps;
  directoryHandler?: string;
  tarkovGamePathHandler?: FileSystemDirectoryHandle;
  tarkovGamePathFromRust?: string;
  show: boolean;
}

const Index = (props: MapInfoProps) => {
  const {
    mapData,
    raidInfo,
    directoryHandler,
    tarkovGamePathHandler,
    tarkovGamePathFromRust,
    show,
  } = props;
  const hasTarkovPath = tarkovGamePathHandler || tarkovGamePathFromRust;

  const [realTime, setRealTime] = useState(0);
  const [timeDiff, setTimeDiff] = useState(0);

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const tarkovTime = useMemo(() => {
    return (((realTime + timeDiff) * 7) % (24 * 3600000)) - 5 * 3600000;
  }, [realTime, timeDiff]);

  useEffect(() => {
    const machineTime = dayjs().valueOf();
    setRealTime(machineTime);
    setTimeDiff(0);
  }, []);

  useInterval(() => {
    setRealTime(dayjs().valueOf());
  }, show ? 1000 : undefined);

  return (
    <div
      className={classNames('im-mapinfo', {
        active: show,
      })}
    >
      <div className="im-mapinfo-title">
        <span>{t('mapInfo.title')}</span>
      </div>
      <div className="im-mapinfo-item">
        <span className="im-mapinfo-item-title">{t('mapInfo.gameTime')}</span>
        <span className="tarkov-time">{dayjs(tarkovTime).format('HH:mm:ss')}</span>
        <span className="tarkov-time">{dayjs(tarkovTime).add(12, 'hours').format('HH:mm:ss')}</span>
      </div>
      {mapData.players && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">{t('mapInfo.pmcs')}</span>
          <span>{mapData.players}</span>
        </div>
      )}
      {mapData.raidDuration && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">{t('mapInfo.raidTime')}</span>
          <span>
            {mapData.raidDuration} {t('common.minute')}
          </span>
        </div>
      )}
      {self === top && window.showDirectoryPicker && !directoryHandler && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title warning">{t('mapInfo.noScreenshotDir')}</span>
        </div>
      )}
      {self === top &&
        (window.showDirectoryPicker || (window as any).__TAURI__) &&
        !hasTarkovPath && (
          <div className="im-mapinfo-item">
            <span className="im-mapinfo-item-title warning">
              {t('mapInfo.noGameDir')}
            </span>
          </div>
      )}
      {raidInfo?.ip && raidInfo?.port && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">{t('mapInfo.serverIP')}</span>
          <span>
            {raidInfo.ip}:{raidInfo.port}
          </span>
        </div>
      )}
      {raidInfo?.gameMode && raidInfo?.raidMode && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">{t('mapInfo.gameMode')}</span>
          <span>
            {raidInfo.gameMode} ({raidInfo.raidMode})
          </span>
        </div>
      )}
      {raidInfo?.shortId && (
        <div className="im-mapinfo-item">
          <span className="im-mapinfo-item-title">{t('mapInfo.raidId')}</span>
          <span>{raidInfo.shortId}</span>
        </div>
      )}
    </div>
  );
};

Index.displayName = 'MapInfo';
export default React.memo(Index);
