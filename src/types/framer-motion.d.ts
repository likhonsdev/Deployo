/**
 * Type declarations for framer-motion
 */
declare module 'framer-motion' {
  import * as React from 'react';

  // Common types used in framer-motion
  type VariantLabels = string | string[];
  type TargetAndTransition = any;
  
  interface MotionProps {
    initial?: boolean | VariantLabels | TargetAndTransition;
    animate?: VariantLabels | TargetAndTransition;
    exit?: VariantLabels | TargetAndTransition;
    variants?: {
      [key: string]: TargetAndTransition;
    };
    transition?: {
      duration?: number;
      delay?: number;
      type?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  // motion components
  type Motion = {
    [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
      JSX.IntrinsicElements[K] & MotionProps & React.RefAttributes<Element>
    >;
  };

  export const motion: Motion;
  
  // AnimatePresence component
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    initial?: boolean;
    custom?: any;
    exitBeforeEnter?: boolean;
    onExitComplete?: () => void;
    [key: string]: any;
  }

  export const AnimatePresence: React.FC<AnimatePresenceProps>;
}
