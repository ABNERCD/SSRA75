import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; 
import { IncapacitacionOperadorComponent } from './incapacitacion-operador'; 

describe('IncapacitacionOperadorComponent', () => {
  let component: IncapacitacionOperadorComponent;
  let fixture: ComponentFixture<IncapacitacionOperadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser standalone, se importa directamente aquí
      imports: [ 
        ReactiveFormsModule, 
        IncapacitacionOperadorComponent 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapacitacionOperadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reportForm with 21 controls', () => {
    const formControlsCount = Object.keys(component.reportForm.controls).length;
    expect(formControlsCount).toBe(21);
  });

  it('should make the hazardDetailDescription control required', () => {
    const control = component.reportForm.get('hazardDetailDescription');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    
    control?.setValue('Descripción de prueba de incapacitación de operador');
    expect(control?.valid).toBeTruthy();
  });
});