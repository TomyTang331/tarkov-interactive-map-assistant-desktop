import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';

import { ImageConfig } from 'konva/lib/shapes/Image';

interface ImageProps {
  imageSrc: string;
}

type OmitImageConfig = Omit<ImageConfig, 'image'>;

// LRU image cache — capped at 200 entries to bound memory
const CACHE_MAX = 200;
const imageCache = new Map<string, HTMLImageElement>();
const imageLoadingPromises = new Map<string, Promise<HTMLImageElement>>();
const imageAccessOrder: string[] = [];

function touchCacheEntry(src: string) {
  const idx = imageAccessOrder.indexOf(src);
  if (idx !== -1) imageAccessOrder.splice(idx, 1);
  imageAccessOrder.push(src);
}

function evictCache() {
  while (imageCache.size >= CACHE_MAX) {
    const oldest = imageAccessOrder.shift();
    if (oldest) {
      imageCache.delete(oldest);
      imageLoadingPromises.delete(oldest);
    }
  }
}

interface ImageState { image: HTMLImageElement | undefined; status: string }

function useCachedImage(src: string): [HTMLImageElement | undefined, string] {
  const [state, setState] = useState<ImageState>(() => {
    const cached = imageCache.get(src);
    if (cached) {
      touchCacheEntry(src);
      return { image: cached, status: 'loaded' };
    }
    return { image: undefined, status: 'loading' };
  });

  useEffect(() => {
    if (imageCache.has(src)) {
      touchCacheEntry(src);
      setState({ image: imageCache.get(src), status: 'loaded' });
      return;
    }

    // Deduplicate in-flight requests for the same URL
    let promise = imageLoadingPromises.get(src);
    if (!promise) {
      promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          evictCache();
          imageCache.set(src, img);
          touchCacheEntry(src);
          imageLoadingPromises.delete(src);
          resolve(img);
        };
        img.onerror = () => {
          imageLoadingPromises.delete(src);
          reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
      });
      imageLoadingPromises.set(src, promise);
    }

    promise
      .then((img) => setState({ image: img, status: 'loaded' }))
      .catch(() => setState({ image: undefined, status: 'failed' }));
  }, [src]);

  return [state.image, state.status];
}

const Index = (props: OmitImageConfig & ImageProps) => {
  const { imageSrc } = props;
  const [image, status] = useCachedImage(imageSrc);

  if (status === 'loaded') {
    return <Image image={image} {...props} />;
  }
  return null;
};

Index.displayName = 'Image';
export default React.memo(Index);
