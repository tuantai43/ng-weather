import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  private locations: string[] = [];
  private locationsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private locationsAddSubject: Subject<string> = new Subject<string>();
  locationAdd$: Observable<string> = this.locationsAddSubject.asObservable();
  locations$: Observable<string[]> = this.locationsSubject.asObservable();

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    this.emitLocationsUpdate();
  }

  private emitLocationsUpdate() {
    this.locationsSubject.next([...this.locations]);
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.locationsAddSubject.next(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}
