import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, catchError, takeUntil, throwError } from 'rxjs';
import { WeatherApiResponse } from 'src/app/types/weatherApiResponse';
import { WeatherData } from 'src/app/types/weatherData';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.scss'],
})
export class CityWeatherComponent implements OnInit, OnDestroy {
  WeatherData!: WeatherData;
  cityWeather = 'London';
  private searchStream = new Subject<string>();
  public location = new FormControl();
  errorMessage = '';
  destroy$ = new Subject<void>();
  private apiURl = environment.apiURL;
  private apiKey = environment.apiURL;

  constructor(private http: HttpClient) {}

  locationGroup = new FormGroup({
    location: new FormControl(),
  });

  ngOnInit() {
    this.WeatherData = {
      name: '',
      humidity: 0,
      hasClouds: false,
      isDay: false,
      temp_celcius: '',
      temp_min: '',
      temp_max: '',
      temp_feels_like: '',
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

  getWeatherData(city: string): Observable<WeatherApiResponse> {
    return this.http
      .get<WeatherApiResponse>(
        // `${this.apiURl}/weather?q=${city}&appid=${this.apiKey}`
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

  setWeatherData(data: WeatherApiResponse) {
    this.WeatherData.name = data.name;
    this.WeatherData.humidity = data.main.humidity;
    const sunsetTime = new Date(data.sys.sunset * 1000);
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    this.WeatherData.hasClouds = data?.clouds?.all > 50;
    const currentDate = new Date();
    this.WeatherData.isDay =
      currentDate.getTime() < sunsetTime.getTime() &&
      currentDate.getTime() > sunriseTime.getTime();
    this.WeatherData.temp_celcius = (data.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (data.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (data.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (data.main.feels_like - 273.15).toFixed(
      0
    );
  }

  public onSubmit(e: Event, form: FormGroup) {
    if (form.value.location !== null) {
      this.onGetWeatherData(form.value.location);
      form.reset();
      this.errorMessage = '';
    } else {
      this.errorMessage = 'The field cant be empty';
    }
    form.reset();
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
