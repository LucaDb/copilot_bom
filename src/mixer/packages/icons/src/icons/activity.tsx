import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const IconActivity = React.forwardRef<SVGSVGElement, any>((props, ref) => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-activity" data-icon="icon-activity" aria-hidden="true" {...props} ref={ref}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>);
});

IconActivity.displayName = 'IconActivity';
