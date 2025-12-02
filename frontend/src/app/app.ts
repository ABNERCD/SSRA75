import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 🚨 1. IMPORTACIÓN CLAVE: Importa ReactiveFormsModule
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 🚨 2. AÑADE ReactiveFormsModule a la lista de imports
  imports: [
    RouterOutlet, 
    ReactiveFormsModule 
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Taller75-frontend';
}