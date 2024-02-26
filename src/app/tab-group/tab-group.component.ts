import { NgComponentOutlet } from "@angular/common";
import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
  inject,
} from "@angular/core";
import { LocationService } from "app/location.service";
import { TabItemComponent } from "app/tab-item/tab-item.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-tab-group",
  templateUrl: "./tab-group.component.html",
})
export class TabGroupComponent implements AfterContentInit, OnDestroy {
  @Input({ required: true })
  source: unknown[];

  @ContentChildren(TabItemComponent)
  tabs: QueryList<TabItemComponent>;

  selectedTab: TabItemComponent | null = null;
  currentIndex = -1;
  subscription!: Subscription;

  protected locationService = inject(LocationService);

  ngAfterContentInit(): void {
    // listen for tabs for changes in the number of elements
    this.subscription = this.tabs.changes.subscribe((tabs: QueryList<TabItemComponent>) => this.renderSelectedTab(tabs));
    this.renderSelectedTab(this.tabs);
  }

  renderSelectedTab(tabs: QueryList<TabItemComponent>): void {
    if (!this.selectedTab && tabs.first) {
      // If you haven't selected any tab yet but there is a list of tabs, it will automatically select the first item
      this.selectTab(tabs.first, 0);
    } else if (!tabs.length) {
      // If there are no tabs, set selected to null
      this.selectedTab = null;
    }
  }

  selectTab(tab: TabItemComponent, index: number): void {
    this.selectedTab = tab;
    this.currentIndex = index;
  }

  closeTab(tab: TabItemComponent, index: number): void {
    if (index !== -1) {
      if (this.currentIndex > index) {
        // If you close a tab before the current tab, the index of the current tab is reduced
        this.currentIndex -= 1;
      } else if (this.currentIndex === index) {
        // If you dynamically select the current tab, it will automatically select the first tab
        if (this.tabs.first) {
          this.selectTab(this.tabs.first, 0);
        }
      }

      // Remove tab from tabs list
      this.source.splice(index, 1);
      this.locationService.removeLocation(tab.zipcode);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
