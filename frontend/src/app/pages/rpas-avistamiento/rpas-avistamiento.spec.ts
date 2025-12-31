import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; 
import { RpasAvistamientoComponent } from './rpas-avistamiento'; 

describe('RpasAvistamientoComponent', () => {
  let component: RpasAvistamientoComponent;
  let fixture: ComponentFixture<RpasAvistamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Al ser componente standalone, se importa directamente
      imports: [ 
        ReactiveFormsModule, 
        RpasAvistamientoComponent 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpasAvistamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the reportForm with 22 controls', () => {
    // El conteo ha subido a 22 por los campos específicos de avistamiento
    const formControlsCount = Object.keys(component.reportForm.controls).length;
    expect(formControlsCount).toBe(22);
  });

  it('should make the location control required for sighting', () => {
    const control = component.reportForm.get('location');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    
    control?.setValue('Umbral de pista 15L');
    expect(control?.valid).toBeTruthy();
  });

  it('should validate the droneType as required', () => {
    const control = component.reportForm.get('droneType');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('Multirrotor');
    expect(control?.valid).toBeTruthy();
  });

  it('should mark form as invalid if required fields are missing', () => {
    component.reportForm.get('hazardDetailDescription')?.setValue('');
    expect(component.reportForm.valid).toBeFalsy();
  });
});