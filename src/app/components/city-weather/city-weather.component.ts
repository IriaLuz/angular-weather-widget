import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, catchError, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.scss'],
})
export class CityWeatherComponent implements OnInit, OnDestroy {
  WeatherData: any;
  cityWeather = 'London';
  private searchStream = new Subject<string>();
  public location = new FormControl();
  errorMessage = '';
  destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  locationGroup = new FormGroup({
    location: new FormControl(),
  });

  ngOnInit() {
    this.WeatherData = {
      main: {},
      isDay: true,
      clouds: {},
      hasClouds: false,
    };
    this.onGetWeatherData(this.cityWeather);
  }

  onGetWeatherData(cityWeather: string): void {
    this.getWeatherData(cityWeather)
      .pipe(takeUntil(this.destroy$))
      .subscribe((weatherData) => {
        this.setWeatherData(weatherData),
          (error: Error) => console.log(error.message);
      });
  }

  getWeatherData(city: string): Observable<any> {
    return this.http
      .get<any>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ff1bc4683fc7325e9c57e586c20cc03e`
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  handleError(errorResponse: HttpErrorResponse) {
    const errorResponseMessage = errorResponse.error.message;
    this.errorMessage = 'Please enter an existing city';
    console.log('Error:');
    return throwError(() => new Error(errorResponseMessage));
  }

  setWeatherData(data: any) {
    this.WeatherData = data;
    const sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    const sunriseTime = new Date(this.WeatherData.sys.sunrise * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    this.WeatherData.hasClouds = this.WeatherData?.clouds?.all > 50;
    const currentDate = new Date();
    this.WeatherData.isDay =
      currentDate.getTime() < sunsetTime.getTime() &&
      currentDate.getTime() > sunriseTime.getTime();
    this.WeatherData.temp_celcius = (
      this.WeatherData.main.temp - 273.15
    ).toFixed(0);
    this.WeatherData.temp_min = (
      this.WeatherData.main.temp_min - 273.15
    ).toFixed(0);
    this.WeatherData.temp_max = (
      this.WeatherData.main.temp_max - 273.15
    ).toFixed(0);
    this.WeatherData.temp_feels_like = (
      this.WeatherData.main.feels_like - 273.15
    ).toFixed(0);
  }

  public onSubmit(e: Event, form: FormGroup) {
    this.onGetWeatherData(form.value.location);
    form.reset();
    this.errorMessage = '';
  }

  public onSearchLocation(event: Event, cityName: string) {
    if (cityName && cityName.length > 0) {
      this.searchStream.next(cityName);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
