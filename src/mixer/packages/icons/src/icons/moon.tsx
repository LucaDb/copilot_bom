import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const IconMoon = React.forwardRef<SVGSVGElement, any>((props, ref) => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-moon" data-icon="icon-moon" aria-hidden="true" {...props} ref={ref}><path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>);
});

IconMoon.displayName = 'IconMoon';
