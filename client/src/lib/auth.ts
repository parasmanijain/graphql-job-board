// Disclaimer: This example keeps the access token in LocalStorage just because
// it's simpler, but in a real application you may want to use cookies instead
// for better security. Also, it doesn't handle token expiration.

import { jwtDecode } from "jwt-decode";
import { User } from "../models/shared.js";

const API_URL = "http://localhost:9000";
const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function login(
  email: string,
  password: string
): Promise<User | null> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return null;
  }

  const data: { token: string } = await response.json();
  localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
  return getUserFromToken(data.token);
}

export function getUser(): User | null {
  const token = getAccessToken();
  if (!token) return null;
  return getUserFromToken(token);
}

export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper to decode token into User
function getUserFromToken(token: string): User {
  type JwtClaims = {
    sub: string;
    email: string;
    [key: string]: any; // for any extra claims
  };

  const claims = jwtDecode<JwtClaims>(token);
  return {
    id: claims.sub,
    email: claims.email,
  };
}
