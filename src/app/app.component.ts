import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Subscription } from "rxjs";
import { WeatherService } from "./weather.service";
import { LocationService } from "./location.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);

  ngOnInit(): void {
    this.locationService.locations$
      .subscribe((data) => {
        for (let loc of data) {
          this.weatherService.addCurrentConditions(loc);
        }
      })
      .unsubscribe();
    this.subscription = this.locationService.locationAdd$.subscribe((zipcode) => {
      this.weatherService.addCurrentConditions(zipcode);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
