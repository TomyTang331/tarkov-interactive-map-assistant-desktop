import React, { useMemo } from 'react';
import { Group } from 'react-konva';

import Image from '../Image';

interface TileLayerProps {
  tilePath: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  mapScale: number;
  mapPosition: { x: number; y: number };
  resolution: { width: number; height: number };
  coordinateRotation?: number;
  opacity?: number;
}

const Index = React.memo((props: TileLayerProps) => {
  const {
    tilePath,
    tileSize,
    minZoom,
    maxZoom,
    mapScale,
    mapPosition,
    resolution,
    coordinateRotation = 180,
    opacity = 1,
  } = props;

  const { zoom, scale, size, visible } = useMemo(() => {
    const effectiveZoom = Math.max(
      minZoom,
      Math.min(maxZoom, Math.round(minZoom + Math.log2(Math.max(0.25, mapScale)))),
    );
    const n = 2 ** effectiveZoom;
    const layerSize = n * tileSize;
    const scaleFactor = 2 ** (minZoom - effectiveZoom);

    const leftVirtual = -mapPosition.x / mapScale;
    const topVirtual = -mapPosition.y / mapScale;
    const widthVirtual = resolution.width / mapScale;
    const heightVirtual = resolution.height / mapScale;
    const leftLocal = leftVirtual / scaleFactor;
    const topLocal = topVirtual / scaleFactor;
    const widthLocal = widthVirtual / scaleFactor;
    const heightLocal = heightVirtual / scaleFactor;
    const padding = 1;
    const xMin = Math.max(0, Math.floor(leftLocal / tileSize) - padding);
    const xMax = Math.min(n - 1, Math.ceil((leftLocal + widthLocal) / tileSize) + padding);
    const yMin = Math.max(0, Math.floor(topLocal / tileSize) - padding);
    const yMax = Math.min(n - 1, Math.ceil((topLocal + heightLocal) / tileSize) + padding);

    return {
      zoom: effectiveZoom,
      scale: scaleFactor,
      size: layerSize,
      visible: { xMin, xMax, yMin, yMax },
    };
  }, [
    minZoom,
    maxZoom,
    mapScale,
    mapPosition.x,
    mapPosition.y,
    resolution.width,
    resolution.height,
    tileSize,
  ]);

  const tiles: React.ReactNode[] = [];
  const { xMin, xMax, yMin, yMax } = visible;
  for (let y = yMin; y <= yMax; y++) {
    for (let x = xMin; x <= xMax; x++) {
      const url = tilePath
        .replace(/\{z\}/g, String(zoom))
        .replace(/\{x\}/g, String(x))
        .replace(/\{y\}/g, String(y));
      tiles.push(
        <Image
          key={`${zoom}-${x}-${y}`}
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

  const rotationGroup = (() => {
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
          scaleX={1}
          scaleY={1}
          listening={false}
        >
          {content}
        </Group>
      );
    }
    return (
      <Group
        rotation={coordinateRotation === 180 ? 0 : coordinateRotation - 180}
        listening={false}
      >
        {content}
      </Group>
    );
  })();

  return (
    <Group scaleX={scale} scaleY={scale} listening={false}>
      {rotationGroup}
    </Group>
  );
});

Index.displayName = 'TileLayer';
export default Index;
