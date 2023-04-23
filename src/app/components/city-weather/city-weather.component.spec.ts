import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CityWeatherComponent } from './city-weather.component';

describe('CityWeatherComponent', () => {
  let component: CityWeatherComponent;
  let fixture: ComponentFixture<CityWeatherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CityWeatherComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the weather data', () => {
    const data = {
      main: {
        temp: 290,
        temp_min: 288,
        temp_max: 292,
        feels_like: 288,
        humidity: 80,
      },
      sys: {
        sunset: 1632400592,
      },
      name: 'London',
    };
    component.setWeatherData(data);
    expect(component.WeatherData.temp_celcius).toBe('17');
    expect(component.WeatherData.temp_min).toBe('15');
    expect(component.WeatherData.temp_max).toBe('19');
    expect(component.WeatherData.temp_feels_like).toBe('15');
    expect(component.WeatherData.name).toBe('London');
    expect(component.WeatherData.main.humidity).toBe(80);
  });

  it('should get weather data on form submit', () => {
    spyOn(component, 'getWeatherData');
    const form = component.locationGroup;
    form.controls['location'].setValue('Paris');
    fixture.detectChanges();
    const submitButton =
      fixture.debugElement.nativeElement.querySelector('button');
    submitButton.click();
    expect(component.getWeatherData).toHaveBeenCalledWith('Paris');
  });
});
