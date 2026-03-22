import React from 'react';
import { Image, Text } from 'react-konva';

import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

interface BaseMapProps {
  id: string;
  baseMap: HTMLImageElement | undefined;
  activeLayer: InteractiveMap.Layer | undefined;
  status: 'loaded' | 'loading' | 'failed';
  coordinateRotation?: number;
  resolution: { width: number; height: number };
  tileOnlyUnsupported?: boolean;
}

const Index = React.memo((props: BaseMapProps) => {
  const {
    id,
    baseMap,
    activeLayer,
    status,
    coordinateRotation = 180,
    resolution,
    tileOnlyUnsupported,
  } = props;

  const [lang] = useRecoilState(langState);
  const { t } = useI18N(lang);

  if (baseMap && status === 'loaded') {
    if (coordinateRotation === 90) {
      return (
        <Image
          id={id}
          image={baseMap}
          rotation={coordinateRotation - 180}
          offset={{ x: baseMap.width, y: 0 }}
          scaleX={Math.abs(baseMap.height / baseMap.width)}
          scaleY={Math.abs(baseMap.width / baseMap.height)}
          opacity={activeLayer ? 0.1 : 1}
        />
      );
    } else if (coordinateRotation === 180) {
      return (
        <Image
          id={id}
          image={baseMap}
          rotation={coordinateRotation - 180}
          offset={{ x: 0, y: 0 }}
          scaleX={1}
          scaleY={1}
          opacity={activeLayer ? 0.1 : 1}
        />
      );
    } else if (coordinateRotation === 270) {
      return (
        <Image
          id={id}
          image={baseMap}
          rotation={coordinateRotation - 180}
          offset={{ x: 0, y: baseMap.height }}
          scaleX={Math.abs(baseMap.height / baseMap.width)}
          scaleY={Math.abs(baseMap.width / baseMap.height)}
          opacity={activeLayer ? 0.1 : 1}
        />
      );
    }
  } else if (status === 'loading') {
    return (
      <Text
        id={id}
        fontFamily="JinBuTi"
        text={t('map.loading')}
        fontSize={24}
        fill="#cccccc"
        width={resolution.width}
        height={resolution.height}
        align="center"
        verticalAlign="middle"
        shadowColor="#000000"
        shadowBlur={6}
      />
    );
  } else if (status === 'failed') {
    return (
      <Text
        id={id}
        fontFamily="JinBuTi"
        text={tileOnlyUnsupported ? '该地图为瓦片图，当前版本暂不支持，请选择其他地图' : '地图载入失败...'}
        fontSize={24}
        fill="#cccccc"
        width={resolution.width}
        height={resolution.height}
        align="center"
        verticalAlign="middle"
        shadowColor="#000000"
        shadowBlur={6}
      />
    );
  }
});

Index.displayName = 'BaseMap';
export default Index;
