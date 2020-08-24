import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OverlayConfiguration, OverlayDispatcherService} from '../../../overlay/overlay-dispatcher.service';
import {ImageCropComponent} from './image-crop.component';
import {filter} from 'rxjs/operators';

export enum ImageOperations { None, Crop}
export enum ImageToolbarActions { None, Show, Hide}

@Component({
  selector: 'app-image-toolbar',
  template: `
    <div style="border: 1px orange solid; display: inline-block">
      <p>
        &#10532;<a href="#" class="button underline" (click)="showCrop($event)">Crop</a>
      </p>
    </div>
  `,
  styles: []
})
export class ImageToolbarComponent {
  private overlayRef: OverlayConfiguration = null;
  private imageOverlayRef: OverlayConfiguration = null;
  @Output() toolbarAction: EventEmitter<[ImageOperations, ImageToolbarActions]> = new EventEmitter();
  constructor(private overlayDispatcher: OverlayDispatcherService) {
    this.overlayDispatcher.$overlayDispatcher.pipe(filter((overlayRef) => overlayRef.subject === '/image/preview/toolbar'))
      .subscribe((overlayRef) => {
        this.overlayRef = overlayRef;
        console.log('TOOLBAR: ' + this.overlayRef.properties.chainId);
      });
  }

  showCrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toolbarAction.emit([ImageOperations.Crop, ImageToolbarActions.Show]);
    this.overlayDispatcher.readOverlay(this.overlayRef.hostNativeElementRef, { subject: '/image/preview/crop' })
      .subscribe((overlayRef) => { this.imageOverlayRef = overlayRef; }, () => {}, () => {
        if (!this.imageOverlayRef) {
          this.overlayDispatcher.createOverlay(this.overlayRef.hostNativeElementRef, {
            subject: '/image/preview/crop',
            component: ImageCropComponent,
            properties: { chainId: this.overlayRef.properties.chainId },
            classes: [],
            zIndex: 2,
          }).pipe(
              filter(overlayRef => overlayRef.action === 'CREATE'),
              filter(overlayRef => overlayRef.subject === '/image/preview/crop')
            ).subscribe((overlayRef) => {
            this.imageOverlayRef = overlayRef;
          });
        }
      });
  }
}
