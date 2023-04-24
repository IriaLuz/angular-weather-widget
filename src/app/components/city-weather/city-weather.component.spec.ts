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
      coord: {
        lon: -89.6167,
        lat: 20.9667,
      },
      weather: [
        {
          id: 802,
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03n',
        },
      ],
      base: 'stations',
      main: {
        temp: 300.99,
        feels_like: 302.58,
        temp_min: 300.99,
        temp_max: 300.99,
        pressure: 1006,
        humidity: 62,
        sea_level: 1006,
        grnd_level: 1005,
      },
      visibility: 10000,
      wind: {
        speed: 5.21,
        deg: 64,
        gust: 12.91,
      },
      clouds: {
        all: 28,
      },
      dt: 1682298014,
      sys: {
        country: 'UK',
        sunrise: 1682249608,
        sunset: 1682295588,
      },
      timezone: -21600,
      id: 3523349,
      name: 'London',
      cod: 200,
    };
    component.setWeatherData(data);
    expect(component.WeatherData.temp_celcius).toBe('28');
    expect(component.WeatherData.temp_min).toBe('28');
    expect(component.WeatherData.temp_max).toBe('28');
    expect(component.WeatherData.temp_feels_like).toBe('29');
    expect(component.WeatherData.name).toBe('London');
    expect(component.WeatherData.humidity).toBe(62);
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
