import { Component, Input, TemplateRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-tab-item",
  templateUrl: "./tab-item.component.html",
})
export class TabItemComponent {
  @Input()
  label = "";

  @Input()
  zipcode = "";

  @ViewChild("tabContent")
  content: TemplateRef<HTMLElement>;
}
