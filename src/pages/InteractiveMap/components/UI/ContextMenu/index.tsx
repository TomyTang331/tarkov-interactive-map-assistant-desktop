import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { message } from 'tilty-ui';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import './style.less';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let showContextMenu = (props: InteractiveMap.Position2D) => {
  // no-op fallback; replaced when component mounts
};

const Index = () => {
  const [position, setPosition] = useState<InteractiveMap.Position2D>({
    x: 0,
    y: 0,
  });
  const [show, setShow] = useState(false);

  const [lang] = useRecoilState(langState);
  const { t } = useI18N(lang);

  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    showContextMenu = (props: InteractiveMap.Position2D) => {
      setPosition(props);
      setTimeout(() => setShow(true));
    };
  }, []);

  useEffect(() => {
    const documentClick = (e: MouseEvent) => {
      if (show && contextMenuRef.current) {
        const isClickInside = contextMenuRef.current.contains(e.target as Node);
        if (!isClickInside) {
          setShow(false);
        }
      }
    };
    document.addEventListener('click', documentClick);
    return () => {
      document.removeEventListener('click', documentClick);
    };
  }, [show]);

  return (
    <div
      className={classNames('im-contextmenu', {
        active: show,
      })}
      style={{
        left: position.x + 16,
        top: position.y - 16,
      }}
      ref={contextMenuRef}
    >
      <div className="im-contextmenu-item" onClick={() => message.show({ content: t('contextMenu.developing') })}>
        <span>{t('contextMenu.markCoordinate')}</span>
      </div>
      <div className="im-contextmenu-item" onClick={() => message.show({ content: t('contextMenu.developing') })}>
        <span>{t('contextMenu.addToFavorite')}</span>
      </div>
    </div>
  );
};

export default Index;
