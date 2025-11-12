import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUserName: string | null = null;

  constructor() {
    this.loggedInUserName = localStorage.getItem('currentUser');
  }

  // Llamado por login.ts
  login(username: string): void {
    this.loggedInUserName = username;
    localStorage.setItem('currentUser', username);
  }

  // Llamado por dashboard.ts
  getUserName(): string | null {
    return this.loggedInUserName;
  }

  // <<-- ¡NECESITAS AÑADIR ESTE MÉTODO! -->>
  /**
   * Limpia el nombre de usuario de la memoria del servicio y del almacenamiento local.
   */
  logout(): void {
    this.loggedInUserName = null;
    localStorage.removeItem('currentUser');
  }
}