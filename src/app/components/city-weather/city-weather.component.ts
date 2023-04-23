import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrls: ['./city-weather.component.scss'],
})
export class CityWeatherComponent implements OnInit {
  WeatherData: any;
  cityWeather = 'London';
  private searchStream = new Subject<string>();
  public location = new FormControl();
  errorMessage = '';

  constructor(private http: HttpClient) {}

  locationGroup = new FormGroup({
    location: new FormControl(),
  });

  ngOnInit() {
    this.getWeatherData(this.cityWeather);
    this.WeatherData = {
      main: {},
      isDay: true,
      clouds: {},
      hasClouds: false,
    };
    this.getWeatherData(this.cityWeather);
  }

  getWeatherData(city: string) {
    this.http
      .get<any>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ff1bc4683fc7325e9c57e586c20cc03e`
      )
      .subscribe(
        (data) => {
          this.setWeatherData(data);
        },
        (error) => {
          console.log('Error:', error);
          this.errorMessage = `Please add an existing city `;
        }
      );
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
    this.getWeatherData(form.value.location);
    form.reset();
    this.errorMessage = '';
  }

  public onSearchLocation(event: Event, cityName: string) {
    if (cityName && cityName.length > 0) {
      this.searchStream.next(cityName);
    }
  }
}
