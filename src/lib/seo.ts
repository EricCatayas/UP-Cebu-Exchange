
export const getSiteUrl = () => {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_BASE_URL;

  const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
};

export const getMetadataBase = () => new URL(getSiteUrl());

export const absoluteUrl = (path: string = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
};
