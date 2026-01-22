import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  // Cambia esta URL por la dirección real de tu servidor backend
  private apiUrl = 'http://127.0.0.1:8000/api/v1/reportes';

  constructor(private http: HttpClient) { }

  // Este método enviará los datos a la tabla de reportes voluntarios
  guardarReporteVoluntario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/voluntario/`, data);
  }
}
