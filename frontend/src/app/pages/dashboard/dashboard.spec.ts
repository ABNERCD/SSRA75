// frontend/src/app/pages/dashboard/dashboard.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Describe el conjunto de pruebas para el componente DashboardComponent
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    // Configuración del módulo de pruebas
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      // Importar módulos necesarios para el testing (Router y HTTP)
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents(); // Compilar los componentes
  });

  // Inicialización de las variables antes de cada prueba
  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ngOnInit
  });

  // Prueba 1: Verifica que el componente se cree correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: Verifica que la función de logout limpie localStorage y redirija
  it('should call logout, clear localStorage and navigate to login', () => {
    // Espía el método navigate del Router y la función removeItem de localStorage
    const routerSpy = spyOn(component['router'], 'navigate');
    const localStorageSpy = spyOn(localStorage, 'removeItem');

    // Simular que hay un token guardado
    localStorage.setItem('access_token', 'fake-token');

    // Llamar a la función de logout
    component.logout();

    // Verificaciones
    expect(localStorageSpy).toHaveBeenCalledWith('access_token');
    expect(routerSpy).toHaveBeenCalledWith(['/auth/login']);
  });
});