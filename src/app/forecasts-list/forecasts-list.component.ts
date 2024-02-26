import { Component, OnDestroy } from "@angular/core";
import { WeatherService } from "../weather.service";
import { ActivatedRoute } from "@angular/router";
import { Forecast } from "./forecast.type";
import { Subscription } from "rxjs";
import { Cookie } from "app/cookie";

@Component({
  selector: "app-forecasts-list",
  templateUrl: "./forecasts-list.component.html",
  styleUrls: ["./forecasts-list.component.css"],
})
export class ForecastsListComponent implements OnDestroy {
  subscription = new Subscription();
  zipcode: string;
  forecast: Forecast;

  constructor(protected weatherService: WeatherService, route: ActivatedRoute) {
    this.subscription.add(
      route.params.subscribe((params) => {
        this.zipcode = params["zipcode"];
        this.subscription.add(
          weatherService.getForecast(this.zipcode).subscribe((data) => {
            this.forecast = data;
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
