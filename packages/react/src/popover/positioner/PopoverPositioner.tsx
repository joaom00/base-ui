'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useForkRef } from '../../utils/useForkRef';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import { usePopoverPositioner } from './usePopoverPositioner';
import { PopoverPositionerContext } from './PopoverPositionerContext';
import type { BaseUIComponentProps } from '../../utils/types';
import type { Side, Align } from '../../utils/useAnchorPositioning';
import { popupStateMapping } from '../../utils/popupStateMapping';
import { HTMLElementType, refType } from '../../utils/proptypes';
import { usePopoverPortalContext } from '../portal/PopoverPortalContext';
import { inertValue } from '../../utils/inertValue';
import { InternalBackdrop } from '../../utils/InternalBackdrop';

/**
 * Positions the popover against the trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
const PopoverPositioner = React.forwardRef(function PopoverPositioner(
  props: PopoverPositioner.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    render,
    className,
    anchor,
    positionMethod = 'absolute',
    side = 'bottom',
    align = 'center',
    sideOffset = 0,
    alignOffset = 0,
    collisionBoundary = 'clipping-ancestors',
    collisionPadding = 5,
    arrowPadding = 5,
    sticky = false,
    trackAnchor = true,
    ...otherProps
  } = props;

  const {
    floatingRootContext,
    open,
    mounted,
    setPositionerElement,
    modal,
    openReason,
    openMethod,
  } = usePopoverRootContext();
  const keepMounted = usePopoverPortalContext();

  const positioner = usePopoverPositioner({
    anchor,
    floatingRootContext,
    positionMethod,
    mounted,
    open,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    collisionBoundary,
    collisionPadding,
    sticky,
    trackAnchor,
    keepMounted,
  });

  const state: PopoverPositioner.State = React.useMemo(
    () => ({
      open,
      side: positioner.side,
      align: positioner.align,
      anchorHidden: positioner.anchorHidden,
    }),
    [open, positioner.side, positioner.align, positioner.anchorHidden],
  );

  const mergedRef = useForkRef(forwardedRef, setPositionerElement);

  const { renderElement } = useComponentRenderer({
    propGetter: positioner.getPositionerProps,
    render: render ?? 'div',
    className,
    state,
    ref: mergedRef,
    extraProps: otherProps,
    customStyleHookMapping: popupStateMapping,
  });

  return (
    <PopoverPositionerContext.Provider value={positioner}>
      {mounted && modal && openReason !== 'hover' && openMethod !== 'touch' && (
        <InternalBackdrop inert={inertValue(!open)} />
      )}
      {renderElement()}
    </PopoverPositionerContext.Provider>
  );
});

namespace PopoverPositioner {
  export interface State {
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
  }

  export interface Props
    extends usePopoverPositioner.SharedParameters,
      BaseUIComponentProps<'div', State> {}
}

PopoverPositioner.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * How to align the popup relative to the specified side.
   * @default 'center'
   */
  align: PropTypes.oneOf(['center', 'end', 'start']),
  /**
   * Additional offset along the alignment axis in pixels.
   * Also accepts a function that returns the offset to read the dimensions of the anchor
   * and positioner elements, along with its side and alignment.
   *
   * - `data.anchor`: the dimensions of the anchor element with properties `width` and `height`.
   * - `data.positioner`: the dimensions of the positioner element with properties `width` and `height`.
   * - `data.side`: which side of the anchor element the positioner is aligned against.
   * - `data.align`: how the positioner is aligned relative to the specified side.
   * @default 0
   */
  alignOffset: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  /**
   * An element to position the popup against.
   * By default, the popup will be positioned against the trigger.
   */
  anchor: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    HTMLElementType,
    refType,
    PropTypes.object,
    PropTypes.func,
  ]),
  /**
   * Minimum distance to maintain between the arrow and the edges of the popup.
   *
   * Use it to prevent the arrow element from hanging out of the rounded corners of a popup.
   * @default 5
   */
  arrowPadding: PropTypes.number,
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
   * An element or a rectangle that delimits the area that the popup is confined to.
   * @default 'clipping-ancestors'
   */
  collisionBoundary: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    HTMLElementType,
    PropTypes.arrayOf(HTMLElementType),
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  ]),
  /**
   * Additional space to maintain from the edge of the collision boundary.
   * @default 5
   */
  collisionPadding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number,
    }),
  ]),
  /**
   * Determines which CSS `position` property to use.
   * @default 'absolute'
   */
  positionMethod: PropTypes.oneOf(['absolute', 'fixed']),
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * Which side of the anchor element to align the popup against.
   * May automatically change to avoid collisions.
   * @default 'bottom'
   */
  side: PropTypes.oneOf(['bottom', 'inline-end', 'inline-start', 'left', 'right', 'top']),
  /**
   * Distance between the anchor and the popup in pixels.
   * Also accepts a function that returns the distance to read the dimensions of the anchor
   * and positioner elements, along with its side and alignment.
   *
   * - `data.anchor`: the dimensions of the anchor element with properties `width` and `height`.
   * - `data.positioner`: the dimensions of the positioner element with properties `width` and `height`.
   * - `data.side`: which side of the anchor element the positioner is aligned against.
   * - `data.align`: how the positioner is aligned relative to the specified side.
   * @default 0
   */
  sideOffset: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  /**
   * Whether to maintain the popup in the viewport after
   * the anchor element was scrolled out of view.
   * @default false
   */
  sticky: PropTypes.bool,
  /**
   * Whether the popup tracks any layout shift of its positioning anchor.
   * @default true
   */
  trackAnchor: PropTypes.bool,
} as any;

export { PopoverPositioner };
