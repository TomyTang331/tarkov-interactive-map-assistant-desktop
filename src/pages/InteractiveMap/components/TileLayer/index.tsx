import React from 'react';
import { Group } from 'react-konva';

import Image from '../Image';

interface TileLayerProps {
  tilePath: string;
  tileSize: number;
  zoom?: number;
  coordinateRotation?: number;
  opacity?: number;
}

/**
 * 瓦片地图底图（如实验室）：按 tilePath 的 {z}/{x}/{y} 请求并拼接瓦片。
 * 虚拟画布尺寸 = 2^zoom * tileSize（与 utils real2imagePos/image2realPos 的虚拟尺寸一致）。
 */
const Index = React.memo((props: TileLayerProps) => {
  const {
    tilePath,
    tileSize,
    zoom = 2,
    coordinateRotation = 180,
    opacity = 1,
  } = props;

  const n = 2 ** zoom;
  const size = n * tileSize;

  const tiles: React.ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const url = tilePath
        .replace(/\{z\}/g, String(zoom))
        .replace(/\{x\}/g, String(x))
        .replace(/\{y\}/g, String(y));
      tiles.push(
        <Image
          key={`${x}-${y}`}
          imageSrc={url}
          x={x * tileSize}
          y={y * tileSize}
          width={tileSize}
          height={tileSize}
          listening={false}
        />,
      );
    }
  }

  const content = (
    <Group opacity={opacity} listening={false}>
      {tiles}
    </Group>
  );

  if (coordinateRotation === 90) {
    return (
      <Group
        rotation={coordinateRotation - 180}
        offset={{ x: size, y: 0 }}
        scaleX={1}
        scaleY={1}
        listening={false}
      >
        {content}
      </Group>
    );
  }
  if (coordinateRotation === 270) {
    return (
      <Group
        rotation={coordinateRotation - 180}
        offset={{ x: 0, y: size }}
        scaleX={Math.abs(1)}
        scaleY={Math.abs(1)}
        listening={false}
      >
        {content}
      </Group>
    );
  }
  // 180 or default
  return (
    <Group rotation={coordinateRotation === 180 ? 0 : coordinateRotation - 180} listening={false}>
      {content}
    </Group>
  );
});

Index.displayName = 'TileLayer';
export default Index;
