'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { mergeProps } from '../../merge-props';
import { useEnhancedEffect } from '../../utils';
import { useScrollAreaViewportContext } from '../viewport/ScrollAreaViewportContext';

const state = {};

/**
 * A container for the content of the scroll area.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area)
 */
const ScrollAreaContent = React.forwardRef(function ScrollAreaContent(
  props: ScrollAreaContent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, ...otherProps } = props;

  const contentWrapperRef = React.useRef<HTMLDivElement | null>(null);

  const { computeThumbPosition } = useScrollAreaViewportContext();

  useEnhancedEffect(() => {
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const ro = new ResizeObserver(computeThumbPosition);

    if (contentWrapperRef.current) {
      ro.observe(contentWrapperRef.current);
    }

    return () => {
      ro.disconnect();
    };
  }, [computeThumbPosition]);

  const { renderElement } = useComponentRenderer({
    render: render ?? 'div',
    className,
    ref: [forwardedRef, contentWrapperRef],
    state,
    extraProps: mergeProps<'div'>(otherProps, {
      role: 'presentation',
      style: {
        minWidth: 'fit-content',
      },
    }),
  });

  return renderElement();
});

namespace ScrollAreaContent {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

ScrollAreaContent.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { ScrollAreaContent };
