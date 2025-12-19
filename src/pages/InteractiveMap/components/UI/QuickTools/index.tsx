import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import classNames from 'classnames';

import { listen } from '@tauri-apps/api/event';

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

  const [strokeType, setStrokeType] = useState<InteractiveMap.StrokeType>('drag');
  const [activeModal, setActiveModal] = useState<InteractiveMap.QuickTools>();
  const [pipActive, setPipActive] = useState(false);

  const handleSelectDraw = () => {
    setStrokeType('draw');
  };

  const handleSelectEraser = () => {
    setStrokeType('eraser');
  };

  const handleCloseModal = () => {
    setActiveModal(undefined);
  };

  const handleTogglePiP = async () => {
    try {
      if (!document.pictureInPictureElement) {
        const canvasElement = document.querySelector('.im-stage canvas') as HTMLCanvasElement;

        if (canvasElement && 'captureStream' in canvasElement) {
          // Force multiple redraws before capturing stream
          const forceRedraw = () => {
            if (typeof (window as any).forceStageRefresh === 'function') {
              (window as any).forceStageRefresh();
            }
          };

          // Use multiple requestAnimationFrame to ensure canvas is drawn
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
              forceRedraw();
              requestAnimationFrame(() => {
                forceRedraw();
                requestAnimationFrame(() => {
                  forceRedraw();
                  resolve();
                });
              });
            });
          });

          // Now create stream after ensuring canvas is rendered
          const stream = canvasElement.captureStream(30);
          const video = document.createElement('video');
          video.srcObject = stream;
          video.muted = true;
          video.playsInline = true;

          await video.play();

          // One more redraw after stream is playing
          forceRedraw();
          await new Promise((resolve) => setTimeout(resolve, 100));

          await video.requestPictureInPicture();
          setPipActive(true);

          toast.info('画中画模式已开启');

          video.addEventListener('leavepictureinpicture', () => {
            setPipActive(false);
            stream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
          });

          (window as any)._pipVideo = video;
        }
      } else {
        await document.exitPictureInPicture();
        setPipActive(false);

        const video = (window as any)._pipVideo;
        if (video && video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
        (window as any)._pipVideo = null;
      }
    } catch (error) {
      console.error('PiP error:', error);
      toast.error('画中画模式启动失败');
    }
  };

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
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      window.removeEventListener('keydown', keydown);
    };
  }, []);

  useEffect(() => {
    const unlisten = listen('toggle-pip', () => {
      handleTogglePiP();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [pipActive]);

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
          // onClick={() => setStrokeType(2)}
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
            title="画中画模式"
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

export default Index;
