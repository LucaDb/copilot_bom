// https://github.com/feathericons/react-feather

import { lazy } from 'react';

export * from './activity';
export * from './moon';
export * from './person-standing';
export * from './sun';
export * from './webhook';
export * from './websolute';

export const Icons = {
  IconActivity: lazy(() => import('./activity').then( module => ({ default: module.IconActivity }) )),
  IconMoon: lazy(() => import('./moon').then( module => ({ default: module.IconMoon }) )),
  IconPersonStanding: lazy(() => import('./person-standing').then( module => ({ default: module.IconPersonStanding }) )),
  IconSun: lazy(() => import('./sun').then( module => ({ default: module.IconSun }) )),
  IconWebhook: lazy(() => import('./webhook').then( module => ({ default: module.IconWebhook }) )),
  IconWebsolute: lazy(() => import('./websolute').then( module => ({ default: module.IconWebsolute }) ))
};
