import React from 'react';

/**
 * Simplified version of framer-motion's AnimatePresence component
 */
export const AnimatePresence: React.FC<{
  initial?: boolean;
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Simplified version of framer-motion's motion component
 * This creates a basic motion.div component that ignores animation props
 */
const createMotionComponent = (Component: string) => {
  return React.forwardRef<HTMLElement, any>((props, ref) => {
    // Extract animation props to ignore them
    const {
      initial,
      animate,
      exit,
      transition,
      ...otherProps
    } = props;
    
    return React.createElement(Component, {
      ref,
      ...otherProps
    });
  });
};

/**
 * Simplified motion object with commonly used components
 */
export const motion = {
  div: createMotionComponent('div'),
  header: createMotionComponent('header')
};
