'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { FloatingFocusManager } from '@floating-ui/react';
import { useDialogPopup } from './useDialogPopup';
import { useDialogRootContext } from '../root/DialogRootContext';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { refType } from '../../utils/proptypes';
import { type BaseUIComponentProps } from '../../utils/types';
import { type TransitionStatus } from '../../utils/useTransitionStatus';
import { type CustomStyleHookMapping } from '../../utils/getStyleHookProps';
import { popupStateMapping as baseMapping } from '../../utils/popupStateMapping';
import { useForkRef } from '../../utils/useForkRef';
import { InteractionType } from '../../utils/useEnhancedClickHandler';
import { transitionStatusMapping } from '../../utils/styleHookMapping';
import { DialogPopupCssVars } from './DialogPopupCssVars';
import { DialogPopupDataAttributes } from './DialogPopupDataAttributes';
import { InternalBackdrop } from '../../utils/InternalBackdrop';
import { useDialogPortalContext } from '../portal/DialogPortalContext';
import { useOpenChangeComplete } from '../../utils/useOpenChangeComplete';
import { inertValue } from '../../utils/inertValue';

const customStyleHookMapping: CustomStyleHookMapping<DialogPopup.State> = {
  ...baseMapping,
  ...transitionStatusMapping,
  nestedDialogOpen(value) {
    return value ? { [DialogPopupDataAttributes.nestedDialogOpen]: '' } : null;
  },
};

/**
 * A container for the dialog contents.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
const DialogPopup = React.forwardRef(function DialogPopup(
  props: DialogPopup.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, finalFocus, initialFocus, render, ...other } = props;

  const {
    descriptionElementId,
    dismissible,
    floatingRootContext,
    getPopupProps,
    modal,
    mounted,
    nested,
    nestedOpenDialogCount,
    setOpen,
    open,
    openMethod,
    popupRef,
    setPopupElement,
    titleElementId,
    transitionStatus,
    onOpenChangeComplete,
    internalBackdropRef,
  } = useDialogRootContext();

  useDialogPortalContext();

  useOpenChangeComplete({
    open,
    ref: popupRef,
    onComplete() {
      if (open) {
        onOpenChangeComplete?.(true);
      }
    },
  });

  const mergedRef = useForkRef(forwardedRef, popupRef);

  const { getRootProps, resolvedInitialFocus } = useDialogPopup({
    descriptionElementId,
    getPopupProps,
    initialFocus,
    modal,
    mounted,
    setOpen,
    openMethod,
    ref: mergedRef,
    setPopupElement,
    titleElementId,
  });

  const nestedDialogOpen = nestedOpenDialogCount > 0;

  const state: DialogPopup.State = React.useMemo(
    () => ({
      open,
      nested,
      transitionStatus,
      nestedDialogOpen,
    }),
    [open, nested, transitionStatus, nestedDialogOpen],
  );

  const { renderElement } = useComponentRenderer({
    render: render ?? 'div',
    className,
    state,
    propGetter: getRootProps,
    extraProps: {
      ...other,
      style: { ...other.style, [DialogPopupCssVars.nestedDialogs]: nestedOpenDialogCount },
    },
    customStyleHookMapping,
  });

  return (
    <React.Fragment>
      {mounted && modal && <InternalBackdrop ref={internalBackdropRef} inert={inertValue(!open)} />}
      <FloatingFocusManager
        context={floatingRootContext}
        disabled={!mounted}
        closeOnFocusOut={dismissible}
        initialFocus={resolvedInitialFocus}
        returnFocus={finalFocus}
      >
        {renderElement()}
      </FloatingFocusManager>
    </React.Fragment>
  );
});

namespace DialogPopup {
  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * Determines the element to focus when the dialog is opened.
     * By default, the first focusable element is focused.
     */
    initialFocus?:
      | React.RefObject<HTMLElement | null>
      | ((interactionType: InteractionType) => React.RefObject<HTMLElement | null>);
    /**
     * Determines the element to focus when the dialog is closed.
     * By default, focus returns to the trigger.
     */
    finalFocus?: React.RefObject<HTMLElement | null>;
  }

  export interface State {
    /**
     * Whether the dialog is currently open.
     */
    open: boolean;
    transitionStatus: TransitionStatus;
    /**
     * Whether the dialog is nested within a parent dialog.
     */
    nested: boolean;
    /**
     * Whether the dialog has nested dialogs open.
     */
    nestedDialogOpen: boolean;
  }
}

DialogPopup.propTypes /* remove-proptypes */ = {
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
   * Determines the element to focus when the dialog is closed.
   * By default, focus returns to the trigger.
   */
  finalFocus: refType,
  /**
   * Determines the element to focus when the dialog is opened.
   * By default, the first focusable element is focused.
   */
  initialFocus: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.func,
    refType,
  ]),
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * @ignore
   */
  style: PropTypes.object,
} as any;

export { DialogPopup };
