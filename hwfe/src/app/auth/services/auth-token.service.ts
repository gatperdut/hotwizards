import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private AUTH_TOKEN_KEY: string = 'jwt_token';

  public set(token: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  public get(): string {
    return localStorage.getItem(this.AUTH_TOKEN_KEY) as string;
  }

  public clear(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }
}
