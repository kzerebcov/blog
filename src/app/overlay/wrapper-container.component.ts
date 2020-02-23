import {Component, ElementRef, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-wrapper-container',
  template: `
    <div style="display: inline-block">
      <ng-container *ngTemplateOutlet="template"></ng-container>
    </div>
  `,
  styles: []
})
export class WrapperContainerComponent implements OnInit {
  @Input() template: TemplateRef<any>;
  constructor(public elementRef: ElementRef) { }
  ngOnInit() { }
}
