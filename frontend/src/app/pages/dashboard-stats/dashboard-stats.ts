import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'; // Importar para rutas
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, HttpClientModule],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.css'
})
export class DashboardStats implements OnInit {
  public chartOptions: any;
  public totalGlobal: number = 0;
  public tituloPanel: string = 'PANEL DE ESTADÍSTICAS SMS'; // Título dinámico

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute, // Para leer el filtro
    private router: Router          // Para el botón regresar
  ) {}

  ngOnInit(): void {
    // Detectamos qué botón se presionó en el menú lateral
    this.route.queryParams.subscribe(params => {
      const filtro = params['filtro'] || 'cantidad';
      this.actualizarInterfaz(filtro);
    });
  }

  // Función para el botón de Regresar
  regresar(): void {
    this.router.navigate(['/dashboard']);
  }

  actualizarInterfaz(tipo: string): void {
    // 1. Cambiamos el título según el botón
    switch(tipo) {
      case 'cantidad':
        this.tituloPanel = 'ESTADÍSTICAS: CANTIDAD DE REPORTES';
        break;
      case 'seguridad':
        this.tituloPanel = 'ESTADÍSTICAS: NIVEL DE RIESGO SMS';
        break;
      case 'consecuencias':
        this.tituloPanel = 'ESTADÍSTICAS: IMPACTO OPERACIONAL';
        break;
      case 'fase':
        this.tituloPanel = 'ESTADÍSTICAS: FASES DE OCURRENCIA';
        break;
    }

    // 2. Cargamos los datos (puedes añadir lógica para diferentes tipos de gráficas aquí)
    this.cargarEstadisticas(tipo);
  }

  cargarEstadisticas(tipo: string): void {
  const url = `http://localhost:8000/api/v1/estadisticas-reporte/dashboard_data/?tipo=${tipo}`;
  
  this.http.get(url).subscribe({
    next: (res: any) => {
      this.totalGlobal = res.total_global;
      
      // Decidimos el tipo de gráfica: Dona para Seguridad/Consecuencias, Barras para el resto
      const chartType = (tipo === 'seguridad' || tipo === 'consecuencias') ? 'donut' : 'bar';
      
      // Forzamos la configuración de la gráfica
      this.configurarGrafica(res.series, res.labels, res.colors, chartType);
    },
    error: (err) => console.error("Error al obtener datos", err)
  });
}

  configurarGrafica(series: any[], labels: string[], colors: string[], type: any): void {
    // Ajuste de datos para gráficas circulares si es necesario
    const chartSeries = (type === 'pie') ? series : [{ name: "Reportes", data: series }];

    this.chartOptions = {
      series: chartSeries,
      chart: {
        type: type,
        height: 380,
        toolbar: { show: type === 'bar' }
      },
      labels: labels, // Requerido para gráficas de dona/pie
      colors: colors,
      plotOptions: {
        bar: { distributed: true, borderRadius: 8, columnWidth: '55%' }
      },
      dataLabels: { enabled: true },
      xaxis: {
        categories: labels,
        labels: { style: { fontSize: '12px', fontWeight: 600 } }
      },
      title: {
        text: this.tituloPanel,
        align: "left",
        style: { color: '#1e3a8a', fontWeight: 'bold' }
      }
    };
  }
}