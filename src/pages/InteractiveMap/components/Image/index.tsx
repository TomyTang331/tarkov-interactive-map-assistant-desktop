import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';

import { ImageConfig } from 'konva/lib/shapes/Image';

interface ImageProps {
  imageSrc: string;
}

type OmitImageConfig = Omit<ImageConfig, 'image'>;

// Global image cache — identical URLs share one HTMLImageElement across all instances
const imageCache = new Map<string, HTMLImageElement>();
const imageLoadingPromises = new Map<string, Promise<HTMLImageElement>>();

interface ImageState { image: HTMLImageElement | undefined; status: string }

function useCachedImage(src: string): [HTMLImageElement | undefined, string] {
  const [state, setState] = useState<ImageState>(() => {
    const cached = imageCache.get(src);
    return cached
      ? { image: cached, status: 'loaded' }
      : { image: undefined, status: 'loading' };
  });

  useEffect(() => {
    if (imageCache.has(src)) {
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
          imageCache.set(src, img);
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
