import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import classNames from 'classnames';
import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import Icon from '@/components/Icon';

import DrawSetting, { DrawSettingProps } from '../DrawSetting';
import EraserSetting, { EraserSettingProps } from '../EraserSetting';
import MarkerSelect, { MarkerSelectProps } from '../MarkerSelect';
import Setting, { SettingProps } from '../Setting';

import './style.less';

interface QuickToolsProps {
  mapInfoActive: boolean;
  isMobile: boolean;
  resolution: { width: number; height: number };
  setQuickSearchShow: (visible: boolean) => void;
  onMapInfoActive: (mapInfoActive: boolean) => void;
  onStrokeTypeChange: (strokeType: InteractiveMap.StrokeType) => void;
}

const Index = (
  props: QuickToolsProps & MarkerSelectProps & DrawSettingProps & EraserSettingProps & SettingProps,
) => {
  const {
    mapInfoActive,
    isMobile,
    resolution,
    setQuickSearchShow,
    onMapInfoActive,
    onStrokeTypeChange,
  } = props;

  const [lang] = useRecoilState(langState);
  const { t } = useI18N(lang);

  const [strokeType, setStrokeType] = useState<InteractiveMap.StrokeType>('drag');
  const [activeModal, setActiveModal] = useState<InteractiveMap.QuickTools>();
  const [pipActive, setPipActive] = useState(false);
  const setPipActiveRef = useRef(setPipActive);
  const handleTogglePiPRef = useRef<() => Promise<void>>(() => Promise.resolve());
  setPipActiveRef.current = setPipActive;

  const handleSelectDraw = () => {
    setStrokeType('draw');
  };

  const handleSelectEraser = () => {
    setStrokeType('eraser');
  };

  const handleCloseModal = () => {
    setActiveModal(undefined);
  };

  const forceStageRedraw = () => {
    if (typeof (window as any).forceStageRefresh === 'function') {
      (window as any).forceStageRefresh();
    }
  };

  const openVideoPiP = async () => {
    const canvasElement = document.querySelector('.im-stage canvas') as HTMLCanvasElement;
    if (!canvasElement || !('captureStream' in canvasElement)) {
      throw new Error('Map canvas not found or PiP not supported');
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        forceStageRedraw();
        requestAnimationFrame(() => {
          forceStageRedraw();
          requestAnimationFrame(() => {
            forceStageRedraw();
            resolve();
          });
        });
      });
    });

    const stream = canvasElement.captureStream(30);
    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    await video.play();
    forceStageRedraw();
    await new Promise((r) => setTimeout(r, 100));
    await video.requestPictureInPicture();
    (window as any)._pipVideo = video;
    video.addEventListener('leavepictureinpicture', () => {
      setPipActiveRef.current(false);
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      (window as any)._pipVideo = null;
    });
  };

  const closeVideoPiP = async () => {
    try {
      await document.exitPictureInPicture();
    } finally {
      const video = (window as any)._pipVideo;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
      (window as any)._pipVideo = null;
    }
  };

  const handleTogglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        try {
          await closeVideoPiP();
        } finally {
          setPipActive(false);
        }
        return;
      }

      const canvasElement = document.querySelector('.im-stage canvas') as HTMLCanvasElement;
      if (!canvasElement || !('captureStream' in canvasElement)) {
        toast.error(t('pip.canvasNotFound'));
        return;
      }

      await openVideoPiP();
      setPipActive(true);
      toast.info(t('pip.enabled'));
    } catch (error) {
      console.error('PiP error:', error);
      setPipActive(false);
      toast.error(t('pip.failed'));
    }
  };
  handleTogglePiPRef.current = handleTogglePiP;

  useEffect(() => {
    onStrokeTypeChange?.(strokeType);
  }, [strokeType]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      const { target } = e;
      if (target instanceof HTMLElement) {
        if (target.tagName === 'INPUT') return;
      }
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        setStrokeType('drag');
      } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSelectDraw();
      } else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handleSelectEraser();
      } else if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setStrokeType('ruler');
      } else if (!e.ctrlKey && !e.metaKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        handleTogglePiPRef.current?.();
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  useEffect(() => {
    let unlistenFn: (() => void) | null = null;

    (async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        const unlisten = await listen('toggle-pip', () => {
          handleTogglePiPRef.current?.();
        });
        unlistenFn = unlisten;
      } catch {
        // Tauri event API unavailable outside desktop build
      }
    })();

    return () => {
      unlistenFn?.();
    };
  }, []);

  return (
    <div className="im-quicktools">
      <div className="im-quicktools-list">
        <div className="im-quicktools-list-item" onClick={() => setQuickSearchShow(true)}>
          <Icon type="icon-search-fill" />
        </div>
        <div
          className={classNames('im-quicktools-list-item', {
            active: strokeType === 'drag',
          })}
          onClick={() => setStrokeType('drag')}
        >
          <Icon type="icon-cursor-fill" />
        </div>
        {!isMobile && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: strokeType === 'draw',
            })}
            onClick={() => handleSelectDraw()}
            onContextMenu={() => setActiveModal('draw')}
          >
            <Icon type="icon-pencil-fill" />
          </div>
        )}
        {!isMobile && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: strokeType === 'eraser',
            })}
            onClick={() => handleSelectEraser()}
            onContextMenu={() => setActiveModal('eraser')}
          >
            <Icon type="icon-eraser-fill" />
          </div>
        )}
        {(isMobile || resolution.width >= 420) && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: strokeType === 'ruler',
            })}
            onClick={() => setStrokeType('ruler')}
          >
            <Icon type="icon-ruler-fill" />
          </div>
        )}
        <div className="im-quicktools-list-hr" />
        <div className="im-quicktools-list-item" onClick={() => setActiveModal('marker')}>
          <Icon type="icon-flag-fill" />
        </div>
        {(isMobile || resolution.width >= 420) && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: mapInfoActive,
            })}
            onClick={() => onMapInfoActive?.(!mapInfoActive)}
          >
            <Icon type="icon-rss-fill" />
          </div>
        )}
        {(isMobile || resolution.width >= 420) && (
          <div
            className={classNames('im-quicktools-list-item', {
              active: pipActive,
            })}
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePiP();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title={t('pip.title')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
              style={{ pointerEvents: 'none' }}
            >
              <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" />
            </svg>
          </div>
        )}
        <div className="im-quicktools-list-item" onClick={() => setActiveModal('setting')}>
          <Icon type="icon-settings-fill" />
        </div>
      </div>
      <div
        className={classNames('im-quicktools-modal', {
          active: activeModal,
        })}
        onMouseDown={handleCloseModal}
      >
        {activeModal === 'marker' && <MarkerSelect {...props} />}
        {activeModal === 'draw' && <DrawSetting {...props} />}
        {activeModal === 'eraser' && <EraserSetting {...props} />}
        {activeModal === 'setting' && <Setting {...props} />}
      </div>
    </div>
  );
};

Index.displayName = 'QuickTools';
export default React.memo(Index);
