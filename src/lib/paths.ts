export function matchesRoute(pathname: string, route: string): boolean {
  const cleanPath = pathname.split('?')[0];

  // Fast path for static routes
  if (!route.includes('[') && !route.includes(':')) {
    return cleanPath === route || cleanPath.startsWith(route + '/');
  }

  const pathSegs = cleanPath.split('/').filter(Boolean);
  const routeSegs = route.split('/').filter(Boolean);

  if (pathSegs.length !== routeSegs.length) return false;

  for (let i = 0; i < routeSegs.length; i++) {
    const rseg = routeSegs[i];
    const pseg = pathSegs[i];

    const isDynamic = rseg.startsWith(':');
    if (isDynamic) {
      if (!pseg || pseg.length === 0) return false;
      continue;
    }

    if (rseg !== pseg) return false;
  }

  return true;
}
