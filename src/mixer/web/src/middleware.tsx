
import { routeInterceptor } from '@websolutespa/bom-mixer-models';
import { isApiRequest, isNextRequest, isStaticRequest } from '@websolutespa/bom-mixer-store';
import { NextFetchEvent, NextResponse } from 'next/server';

export async function middleware(request: NextRequest, next: NextFetchEvent) {

  /*
   * Skipping well-known request
  */
  if (request.nextUrl.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
    return NextResponse.json({ workspace: { root: '', uuid: '' }});
  }

  /*
   * Skipping static requests
  */
  if (isStaticRequest(request)) {
    NextResponse.next();
    return;
  }

  /*
   * Checking for next private requests
  */
  if (isNextRequest(request)) {
    NextResponse.next();
    return;
  }

  if (isApiRequest(request)) {
    /*
    const url = request.nextUrl.clone();
    request.query = qsDeserialize(url.search, { depth: 10, arrayLimit: 1000 });
    // console.log('request.query', url.search, request.query);
    */
    NextResponse.next();
    return;
  }

  /*
    * Resolving CMS routes
  */
  return await routeInterceptor(request, next);
}
