import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayDirective } from './overlay.directive';
import { WrapperDirective } from './wrapper.directive';
import { OverlayComponent } from './overlay.component';
import { WrapperContainerComponent } from './wrapper-container.component';
import { OverlayDispatcherService } from "./overlay-dispatcher.service";
import { ResizableDirective } from "./resizable.directive";

@NgModule({
  declarations: [
    WrapperContainerComponent,
    OverlayComponent,
    OverlayDirective,
    WrapperDirective,
    ResizableDirective
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [OverlayComponent, WrapperContainerComponent],
  providers: [OverlayDispatcherService],
  exports: [
    OverlayDirective,
    ResizableDirective
  ]
})

export class OverlayModule { }
