import { useEffect, useRef, useState } from 'react';

import { useLocalStorageState } from 'ahooks';
import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { UAParser } from 'ua-parser-js';

import dataImap, { clearMapDataCache, loadMapData } from '@/data/interactive_maps';
import langState from '@/store/lang';

import useI18N from '../../i18n';
import Canvas from './components/Canvas';
import ContextMenu from './components/UI/ContextMenu';
import Coordinate from './components/UI/Coordinate';
import EFTWatcher from './components/UI/EFTWatcher';
import MapInfo from './components/UI/MapInfo';
import MapSelect from './components/UI/MapSelect';
import QuickTools from './components/UI/QuickTools';
import Tooltip from './components/UI/Tooltip';
import Warning from './components/UI/Warning';
import { getLayer } from './utils';

import './style.less';

const Index = () => {
  const [mapList, setMapList] = useState<InteractiveMap.Data[]>([]);
  const [activeMapId, setActiveMapId] = useState<string>();
  const [activeMap, setActiveMap] = useState<InteractiveMap.Data>();
  const [activeLayer, setActiveLayer] = useState<InteractiveMap.Layer>();
  const [utils, setUtils] = useState<InteractiveMap.UtilProps>();

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [resolution, setResolution] = useState({ width: 0, height: 0 });
  const [simpleUIMode, setSimpleUIMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [directoryHandler, setDirectoryHandler] = useState<string>();
  const prevMapIdRef = useRef<string>();

  const [extracts, setExtracts] = useLocalStorageState<InteractiveMap.Faction[]>('im-extracts', {
    defaultValue: ['pmc', 'scav', 'shared'],
  });
  const [locks, setLocks] = useLocalStorageState<string[]>('im-locks', {
    defaultValue: ['lock'],
  });
  const [lootKeys, setLootKeys] = useLocalStorageState<string[]>('im-lootKeys', {
    defaultValue: ['safe', 'jacket', 'pc-block', 'cache', 'medcase', 'plastic-suitcase'],
  });
  const [spawns, setSpawns] = useLocalStorageState<string[]>('im-spawns', {
    defaultValue: ['scav', 'sniper_scav', 'boss'],
  });
  const [hazards, setHazards] = useLocalStorageState<string[]>('im-hazards', {
    defaultValue: ['hazard'],
  });
  const [stationaryWeapons, setStationaryWeapons] = useLocalStorageState<string[]>(
    'im-stationaryWeapons',
    {
      defaultValue: [],
    },
  );
  const [mapInfoActive, setMapInfoActive] = useLocalStorageState<boolean>('im-mapInfoActive', {
    defaultValue: true,
  });
  const [locationScale, setLocationScale] = useLocalStorageState<boolean>('im-locationScale', {
    defaultValue: true,
  });

  const [lang] = useRecoilState(langState);

  const { t } = useI18N(lang);

  const cursorPositionNextRef = useRef<InteractiveMap.Position2D | null>(null);
  const cursorPositionRafRef = useRef<number | null>(null);

  const handleCursorPositionChange = (_cursorPosition: InteractiveMap.Position2D) => {
    cursorPositionNextRef.current = _cursorPosition;
    if (cursorPositionRafRef.current == null) {
      cursorPositionRafRef.current = requestAnimationFrame(() => {
        cursorPositionRafRef.current = null;
        if (cursorPositionNextRef.current) {
          setCursorPosition(cursorPositionNextRef.current);
        }
      });
    }
  };

  const handleCallbackUtils = (_utils: InteractiveMap.UtilProps) => {
    setUtils(_utils);
  };

  const handleExtractsChange = (_extracts: InteractiveMap.Faction[]) => {
    setExtracts(_extracts);
  };

  const handleLocksChange = (_locks: string[]) => {
    setLocks(_locks);
  };

  const handleLootKeysChange = (_lootKeys: string[]) => {
    setLootKeys(_lootKeys);
  };

  const handleSpawnsChange = (_spawns: string[]) => {
    setSpawns(_spawns);
  };

  const handleHazardsChange = (_hazards: string[]) => {
    setHazards(_hazards);
  };

  const handleStationaryWeaponsChange = (_stationaryWeapons: string[]) => {
    setStationaryWeapons(_stationaryWeapons);
  };

  const handleMapInfoActive = (_mapInfoActive: boolean) => {
    setMapInfoActive(_mapInfoActive);
  };

  const handleClickEftWatcherPath = async () => {
    try {
      const { open } = await import('@tauri-apps/plugin-dialog');
      const { invoke } = await import('@tauri-apps/api/core');
      const { documentDir, join } = await import('@tauri-apps/api/path');

      const defaultPath = await join(await documentDir(), 'Escape from Tarkov', 'Screenshots');
      const selectedPath = await open({
        directory: true,
        multiple: false,
        defaultPath,
      });

      if (selectedPath && typeof selectedPath === 'string') {
        await invoke('set_screenshot_path', { path: selectedPath }).catch(() => { });
        setDirectoryHandler(selectedPath);
      } else {
        setDirectoryHandler(undefined);
      }
    } catch (err) {
      setDirectoryHandler(undefined);
    }
  };

  const handleLocationScaleChange = (_b: boolean) => {
    setLocationScale(_b);
  };

  const handleMapChange = (mapId: string) => {
    setActiveMapId(mapId);
    setActiveLayer(undefined);
  };

  const handleLayerChange = (name: string) => {
    if (activeMap?.layers) {
      setActiveLayer(getLayer(name, activeMap.layers));
    }
  };

  useEffect(() => {
    let cancelled = false;
    if (activeMapId) {
      loadMapData(activeMapId).then((data) => {
        if (!cancelled && data) {
          setActiveMap(data);
          if (prevMapIdRef.current && prevMapIdRef.current !== activeMapId) {
            clearMapDataCache(prevMapIdRef.current);
          }
          prevMapIdRef.current = activeMapId;
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [activeMapId]);

  useEffect(() => {
    if (mapList[0]?.id) {
      setActiveMapId(mapList[0].id);
    }
  }, [mapList]);

  useEffect(() => {
    setMapList(dataImap as any);
  }, []);

  // Auto-detect the default Tarkov screenshot directory
  useEffect(() => {
    const isTauri = typeof (window as any).__TAURI__ !== 'undefined';
    if (!isTauri) return;

    (async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        const { documentDir, join } = await import('@tauri-apps/api/path');

        const defaultPath = await join(await documentDir(), 'Escape from Tarkov', 'Screenshots');
        const exists: boolean = await invoke('path_exists', { path: defaultPath });

        if (exists) {
          await invoke('set_screenshot_path', { path: defaultPath });
          setDirectoryHandler(defaultPath);
        }
      } catch {
        // Directory picker remains available for manual selection
      }
    })();
  }, []);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        setSimpleUIMode((prev) => !prev);
      }
    };
    const resize = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const height = window.innerHeight || document.documentElement.clientHeight;
      setResolution({ width, height });
      const userAgent = new UAParser();
      const _isMobile = ['mobile', 'tablet'].includes(userAgent.getDevice().type || '');
      setIsMobile(_isMobile);
    };
    const unload = (e: BeforeUnloadEvent) => {
      if (self === top) {
        e.preventDefault();
        return false;
      }
    };
    resize();
    window.addEventListener('keydown', keydown);
    window.addEventListener('resize', resize);
    window.addEventListener('beforeunload', unload);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('resize', resize);
      window.removeEventListener('beforeunload', unload);
      if (cursorPositionRafRef.current != null) {
        cancelAnimationFrame(cursorPositionRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let unlistenPromise: Promise<() => void> | null = null;

    (async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        unlistenPromise = listen<{ filename: string }>('screenshot-created', (event) => {
          const { filename } = event.payload;
          if ((window as any).interactUpdateLocation) {
            (window as any).interactUpdateLocation(filename);
          }
        });
      } catch (err) {
        console.error('Failed to listen screenshot-created event:', err);
      }
    })();

    return () => {
      if (unlistenPromise) {
        unlistenPromise.then((unlisten) => unlisten());
      }
    };
  }, []);

  return (
    <div
      className={classNames({
        desktop: !isMobile,
        mobile: isMobile,
        'simple-ui-mode': simpleUIMode,
      })}
    >
      {activeMap ? (
        <div onContextMenu={(e) => e.preventDefault()}>
          <Canvas
            {...resolution}
            mapData={activeMap}
            activeLayer={activeLayer}
            markerExtracts={extracts}
            markerLocks={locks}
            markerLootKeys={lootKeys}
            markerSpawns={spawns}
            markerHazards={hazards}
            markerStationaryWeapons={stationaryWeapons}
            locationScale={locationScale}
            resolution={resolution}
            onCursorPositionChange={handleCursorPositionChange}
            callbackUtils={handleCallbackUtils}
          />
          <div className="im-header">
            <div className="im-header-left">
              <div className="im-header-left-1">
                {resolution.width > 750 && (
                  <MapSelect
                    mapList={mapList}
                    activeMap={activeMap}
                    activeLayer={activeLayer?.name}
                    onMapChange={handleMapChange}
                    onLayerChange={handleLayerChange}
                  />
                )}
              </div>
              {(isMobile || resolution.width >= 420) && (
                <div className="im-header-left-2">
                  <MapInfo
                    mapData={activeMap}
                    directoryHandler={directoryHandler}
                    show={mapInfoActive}
                  />
                </div>
              )}
            </div>
            <div className="im-header-right">
              <div className="im-header-right-1">
                <QuickTools
                  extracts={extracts}
                  locks={locks}
                  lootKeys={lootKeys}
                  spawns={spawns}
                  hazards={hazards}
                  stationaryWeapons={stationaryWeapons}
                  mapInfoActive={mapInfoActive}
                  lootContainers={activeMap.lootContainers}
                  directoryHandler={directoryHandler}
                  locationScale={locationScale}
                  resolution={resolution}
                  isMobile={isMobile}
                  onExtractsChange={handleExtractsChange}
                  onLocksChange={handleLocksChange}
                  onLootKeysChange={handleLootKeysChange}
                  onSpawnsChange={handleSpawnsChange}
                  onHazardsChange={handleHazardsChange}
                  onStationaryWeaponsChange={handleStationaryWeaponsChange}
                  onClickEftWatcherPath={handleClickEftWatcherPath}
                  onLocationScaleChange={handleLocationScaleChange}
                  onMapInfoActive={handleMapInfoActive}
                />
                {resolution.width > 1280 && <Coordinate {...utils} position={cursorPosition} />}
              </div>
            </div>
            <div className="im-footer">
              <div className="im-footer-left">
                {resolution.width <= 750 && (
                  <MapSelect
                    mapList={mapList}
                    activeMap={activeMap}
                    activeLayer={activeLayer?.name}
                    onMapChange={handleMapChange}
                    onLayerChange={handleLayerChange}
                  />
                )}
              </div>
              <div className="im-footer-right">
                {resolution.width <= 1280 && <Coordinate {...utils} position={cursorPosition} />}
              </div>
            </div>
          </div>
          <Tooltip {...resolution} />
          <ContextMenu />
          <Warning />
        </div>
      ) : (
        <div className="im-loading">
          <img src="/images/tomy_logo_round_white.png" />
          <span>{t('interactive.mapLoading')}</span>
        </div>
      )}
      <EFTWatcher
        directoryHandler={directoryHandler}
        onClickEftWatcherPath={handleClickEftWatcherPath}
      />
    </div>
  );
};

export default Index;
