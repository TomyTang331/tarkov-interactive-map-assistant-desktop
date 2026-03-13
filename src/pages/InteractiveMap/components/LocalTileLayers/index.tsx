import React from 'react';
import { Group } from 'react-konva';

import Image from '../Image';

interface LocalTileLayersProps {
  basePath: string;
  layerCount: number;
  gridCols: number;
  gridRows: number;
  tileSize: number;
  flipX?: boolean;
  flipY?: boolean;
  coordinateRotation?: number;
  opacity?: number;
}

const Index = React.memo((props: LocalTileLayersProps) => {
  const {
    basePath,
    layerCount,
    gridCols,
    gridRows,
    tileSize,
    flipX = false,
    flipY = false,
    coordinateRotation = 180,
    opacity = 1,
  } = props;

  const size = { width: gridCols * tileSize, height: gridRows * tileSize };
  const layers: React.ReactNode[] = [];
  const base = basePath.startsWith('/')
    ? `${(import.meta.env.BASE_URL || '').replace(/\/$/, '')}${basePath}`
    : basePath;

  for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const tileNum = row * gridCols + col + 1;
        const url = `${base}/${layerIndex}-${tileNum}.png`;
        const x = flipX ? (gridCols - 1 - col) * tileSize : col * tileSize;
        const y = flipY ? (gridRows - 1 - row) * tileSize : row * tileSize;
        layers.push(
          <Image
            key={`${layerIndex}-${row}-${col}`}
            imageSrc={url}
            x={x}
            y={y}
            width={tileSize}
            height={tileSize}
            listening={false}
          />,
        );
      }
    }
  }

  const content = (
    <Group opacity={opacity} listening={false}>
      {layers}
    </Group>
  );

  const { width: w, height: h } = size;
  if (coordinateRotation === 90) {
    return (
      <Group
        rotation={-90}
        offset={{ x: w, y: 0 }}
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
        rotation={90}
        offset={{ x: 0, y: h }}
        scaleX={1}
        scaleY={1}
        listening={false}
      >
        {content}
      </Group>
    );
  }
  return (
    <Group rotation={coordinateRotation === 180 ? 0 : coordinateRotation - 180} listening={false}>
      {content}
    </Group>
  );
});

Index.displayName = 'LocalTileLayers';
export default Index;
