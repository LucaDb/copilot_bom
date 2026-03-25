import { VisuallyHidden } from '@ariakit/react';
import { IMedia, getClassNames } from '@websolutespa/bom-core';
import { useIntersectionObserver, useMounted, useReducedMotionLocal } from '@websolutespa/bom-mixer-hooks';
import { Box, Button, Media, MediaSize, ResponsiveProps, pickResponsiveProps } from '@websolutespa/bom-mixer-ui';
import { CSSProperties, useEffect, useId, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

export type ImageLoopProps = ResponsiveProps<{
  aspectRatio?: CSSProperties['aspectRatio'];
  height?: CSSProperties['height'];
  width?: CSSProperties['width'];
}>;

export type ImageLoop = ImageLoopProps & {
  items?: IMedia[];
  speed?: number;
  size?: MediaSize;
};

const StyledBox = styled(Box)`
  position: relative;
  width: 100%;
  background: var(--color-neutral-900);
  counter-reset: element;

  .media {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    // z-index: 1;
    // opacity: 0;
    visibility: hidden;
    background: transparent;
    counter-increment: element;

    .image, .video {
      display: block;
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      object-fit: cover;
    }

    &.active {
      // z-index: 2;
      // opacity: 1;
      visibility: visible;
    }

    /*
    &:after {
      content:counter(element);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 30rem;
      color: white;
    }
    */
  }
`;

const StyledButton = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const ImageLoop = ({
  items,
  speed = 1000,
  ...props
}: ImageLoop) => {

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loadingIndex, setLoadingIndex] = useState<number>(0);
  const loaded = useMemo(() => {
    return (items || []).map(x => false);
  }, [items]);

  const elementRef = useRef<HTMLDivElement>(null);

  const isIntersecting = useIntersectionObserver(elementRef, {
    threshold: 0,
    root: null,
    rootMargin: '0px',
  });

  const play = () => {
    const getIndex = (index: number) => {
      return items ? index % items.length : 0;
    };
    const to = setTimeout(() => {
      const nextIndex = getIndex(activeIndex + 1);
      // console.log('ImageLoop.play.activeIndex', activeIndex, 'nextIndex', nextIndex);
      setLoadingIndex(nextIndex);
      if (loaded[nextIndex]) {
        setActiveIndex(nextIndex);
      }
    }, speed);
    // console.log('ImageLoop.play', to);
    return to as unknown as number;
  };

  const pause = (to: number) => {
    // console.log('ImageLoop.pause', to);
    clearTimeout(to);
  };

  const pauseHandler = (to: number) => () => {
    return pause(to);
  };

  const mounted = useMounted();
  const id = useId();
  const { reducedMotionLocal, toggleReducedMotionLocal, setReducedMotionLocal } = useReducedMotionLocal();
  const shouldPlay = isIntersecting && !reducedMotionLocal;

  useEffect(() => {
    if (shouldPlay) {
      const to = play();
      return pauseHandler(to);
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, shouldPlay]);

  const onLoaded = (index: number) => {
    if (index === loadingIndex) {
      loaded[index] = true;
      setActiveIndex(index);
    }
  };

  const [responsiveProps] = pickResponsiveProps(props, 'aspectRatio', 'height', 'width');

  const indexes = [activeIndex, loadingIndex];
  const classNames = getClassNames('image-loop');

  if (!items || items.length === 0) {
    return;
  }

  return (
    <>
      <StyledBox
        ref={elementRef} id={id} className={classNames} aspectRatio={16 / 9} {...responsiveProps}
        aria-label="Galleria animata"
      >
        {mounted && (
          <StyledButton
            aria-controls={id}
            aria-pressed={!reducedMotionLocal}
            onClick={() => toggleReducedMotionLocal()}
            onBlur={() => setReducedMotionLocal(true)}
          >
            <VisuallyHidden>
              {reducedMotionLocal ? 'Play' : 'Pause'}
            </VisuallyHidden>
          </StyledButton>
        )}
        {items.map((item, i) => (
          <Media
            key={`loop-${i}`}
            className={getClassNames({ active: i === activeIndex })}
            item={item}
            {...props}
            eager
            onLoaded={async () => onLoaded(i)}
            canLoad={indexes.includes(i) || loaded[i] === true}
          />
        ))}
      </StyledBox>
    </>
  );
};
