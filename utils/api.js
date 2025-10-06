// Centraliza a URL da API do backend
// Permite sobrepor via EXPO_PUBLIC_API_URL quando necessário
// Como usar:
// - Importe 'url' e chame com o caminho da rota: url('/login')
// - Para ambientes locais, defina EXPO_PUBLIC_API_URL no .env ou variáveis do Expo
const API_URL =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) ||
  "https://nodejs-production-43c7.up.railway.app";

export { API_URL };
export const url = (path) => `${API_URL}${path}`;