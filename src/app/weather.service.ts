import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import * as rxjs from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { ConditionsAndZip } from "./conditions-and-zip.type";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { Cookie } from "./cookie";

@Injectable()
export class WeatherService {
  static readonly EXPIRED_TIME = "expired_time";
  static readonly LOCATION = "location";
  static readonly FORECAST = "forecast";
  static readonly URL = "https://api.openweathermap.org/data/2.5";
  static readonly APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static readonly ICON_URL = "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions: ConditionsAndZip[] = [];
  private expiredTime = 2;

  constructor(private http: HttpClient) {
    // The expiration time will be taken from localstorage, if not then the default will be 2
    // Units are calculated in hours
    const expiredTime = localStorage.getItem(WeatherService.EXPIRED_TIME);
    this.expiredTime = Number(expiredTime ?? 2);
    localStorage.setItem(WeatherService.EXPIRED_TIME, this.expiredTime + "");
  }

  addCurrentConditions(zipcode: string): void {
    const cookieName = WeatherService.LOCATION + zipcode;
    const cacheData = Cookie.GetCookie(cookieName) as string;
    if (cacheData !== "") {
      this.currentConditions.push({ zip: zipcode, data: JSON.parse(cacheData) as CurrentConditions });
    } else {
      // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
      this.http
        .get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
        .subscribe((data) => {
          this.currentConditions.push({ zip: zipcode, data });
          Cookie.SetCookie(cookieName, JSON.stringify(data), Number(localStorage.getItem(WeatherService.EXPIRED_TIME)));
        });
    }
  }

  removeCurrentConditions(zipcode: string) {
    for (let i in this.currentConditions) {
      if (this.currentConditions[i].zip == zipcode) {
        this.currentConditions.splice(+i, 1);
      }
    }
  }

  getCurrentConditions(): ConditionsAndZip[] {
    return this.currentConditions;
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cookieName = WeatherService.FORECAST + zipcode;
    const cacheData = Cookie.GetCookie(cookieName) as string;
    if (cacheData !== "") {
      return of(JSON.parse(cacheData) as Forecast);
    } else {
      // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
      return this.http
        .get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
        .pipe(
          rxjs.tap((data) => {
            Cookie.SetCookie(cookieName, JSON.stringify(data), Number(localStorage.getItem(WeatherService.EXPIRED_TIME)));
          })
        );
    }
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
function tap(): import("rxjs").OperatorFunction<Forecast, Forecast> {
  throw new Error("Function not implemented.");
}
