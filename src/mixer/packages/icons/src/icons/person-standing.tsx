import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const IconPersonStanding = React.forwardRef<SVGSVGElement, any>((props, ref) => {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-person-standing" data-icon="icon-person-standing" aria-hidden="true" {...props} ref={ref}><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>);
});

IconPersonStanding.displayName = 'IconPersonStanding';
