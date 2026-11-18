export const port = Number(process.env.API_PORT ?? 4000);

export function getCorsOrigins() {
  const origins = (process.env.API_CORS_ORIGIN ?? 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim());
  if (process.env.NODE_ENV !== 'production') {
    for (const origin of ['http://localhost:3001', 'http://localhost:8081']) {
      if (!origins.includes(origin)) origins.push(origin);
    }
  }
  return origins;
}
