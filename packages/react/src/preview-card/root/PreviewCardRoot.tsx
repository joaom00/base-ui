'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { PreviewCardRootContext } from './PreviewCardContext';
import { usePreviewCardRoot } from './usePreviewCardRoot';
import { CLOSE_DELAY, OPEN_DELAY } from '../utils/constants';

/**
 * Groups all parts of the preview card.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Preview Card](https://base-ui.com/react/components/preview-card)
 */
const PreviewCardRoot: React.FC<PreviewCardRoot.Props> = function PreviewCardRoot(props) {
  const { delay, closeDelay, onOpenChangeComplete, actionsRef } = props;

  const delayWithDefault = delay ?? OPEN_DELAY;
  const closeDelayWithDefault = closeDelay ?? CLOSE_DELAY;

  const previewCardRoot = usePreviewCardRoot({
    delay,
    closeDelay,
    actionsRef,
    onOpenChangeComplete,
    open: props.open,
    onOpenChange: props.onOpenChange,
    defaultOpen: props.defaultOpen,
  });

  const contextValue = React.useMemo(
    () => ({
      ...previewCardRoot,
      delay: delayWithDefault,
      closeDelay: closeDelayWithDefault,
    }),
    [closeDelayWithDefault, delayWithDefault, previewCardRoot],
  );

  return (
    <PreviewCardRootContext.Provider value={contextValue}>
      {props.children}
    </PreviewCardRootContext.Provider>
  );
};

namespace PreviewCardRoot {
  export interface State {}

  export interface Props extends usePreviewCardRoot.Parameters {
    children?: React.ReactNode;
  }

  export type Actions = usePreviewCardRoot.Actions;
}

PreviewCardRoot.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * A ref to imperative actions.
   * - `unmount`: When specified, the preview card will not be unmounted when closed.
   * Instead, the `unmount` function must be called to unmount the preview card manually.
   * Useful when the preview card's animation is controlled by an external library.
   */
  actionsRef: PropTypes.shape({
    current: PropTypes.shape({
      unmount: PropTypes.func.isRequired,
    }).isRequired,
  }),
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * How long to wait before closing the preview card. Specified in milliseconds.
   * @default 300
   */
  closeDelay: PropTypes.number,
  /**
   * Whether the preview card is initially open.
   *
   * To render a controlled preview card, use the `open` prop instead.
   * @default false
   */
  defaultOpen: PropTypes.bool,
  /**
   * How long to wait before the preview card opens. Specified in milliseconds.
   * @default 600
   */
  delay: PropTypes.number,
  /**
   * Event handler called when the preview card is opened or closed.
   */
  onOpenChange: PropTypes.func,
  /**
   * Event handler called after any animations complete when the preview card is opened or closed.
   */
  onOpenChangeComplete: PropTypes.func,
  /**
   * Whether the preview card is currently open.
   */
  open: PropTypes.bool,
} as any;

export { PreviewCardRoot };
