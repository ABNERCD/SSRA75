// src/app/pages/home/home.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ya puedes necesitarlo por directivas comunes
import { RouterOutlet, RouterLink } from '@angular/router'; // <-- ¡AGREGA ESTO!

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    //RouterOutlet, // Permite que el <router-outlet> sea conocido
    RouterLink    // Permite que el <routerLink> sea conocido (si lo usas aquí)
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

}