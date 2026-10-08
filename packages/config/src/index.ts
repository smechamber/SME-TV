export const env = {
  apiUrl:
    process.env.EXPO_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:4000',
  apiPort: Number(process.env.API_PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
};
