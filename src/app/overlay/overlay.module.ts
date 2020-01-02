import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayDirective } from './overlay.directive';
import { WrapperDirective } from './wrapper.directive';
import { OverlayComponent } from './overlay.component';
import { WrapperContainerComponent } from './wrapper-container.component';
import { OverlayDispatcherService } from "./overlay-dispatcher.service";

@NgModule({
  declarations: [
    WrapperContainerComponent,
    OverlayComponent,
    WrapperDirective,
    OverlayDirective
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [OverlayComponent, WrapperContainerComponent],
  providers: [OverlayDispatcherService],
  exports: [
    OverlayDirective
  ]
})

export class OverlayModule { }
