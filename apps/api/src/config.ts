export const port = Number(process.env.API_PORT ?? 4000);

export function getCorsOrigins() {
  const origins = (process.env.API_CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim());
  if (process.env.NODE_ENV !== 'production' && !origins.includes('http://localhost:3001')) {
    origins.push('http://localhost:3001');
  }
  return origins;
}
