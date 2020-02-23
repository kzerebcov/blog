import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OverlayConfiguration, OverlayDispatcherService} from "../../../overlay/overlay-dispatcher.service";
import {ImageCropComponent} from "./image-crop.component";
import {filter, single} from "rxjs/operators";

export enum ImageOperations {
  None,
  Crop
}

export enum ImageToolbarActions {
  None,
  Show,
  Hide
}

@Component({
  selector: 'app-image-toolbar',
  template: `    
    <div style="border: 1px orange solid; display: inline-block">
        <p>
            &#10532;<a href="#" class="button underline" (click)="showImageCrop($event)">Crop</a>
        </p>
    </div>
  `,
  styles: []
})
export class ImageToolbarComponent implements OnInit {
  private imageOverlayRef: OverlayConfiguration = null;
  private toolbarOverlayRef: OverlayConfiguration = null;

  @Input() imageData: Blob;
  @Output() toolbarAction: EventEmitter<[ImageOperations, ImageToolbarActions]> = new EventEmitter();

  constructor(private overlayDispatcher: OverlayDispatcherService) { }
  ngOnInit() {}

  overlayHandlerCallback(overlayRef) {
    if (overlayRef.subject === '/image/preview/toolbar') {
      if(!this.toolbarOverlayRef) {
        this.toolbarOverlayRef = overlayRef;
        this.overlayDispatcher.wrapComponentBoundingRect(this.toolbarOverlayRef);
      }
    }
  }

  showImageCrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toolbarAction.emit([ImageOperations.Crop, ImageToolbarActions.Show]);
    if(this.toolbarOverlayRef) {
      this.overlayDispatcher.readOverlay(this.toolbarOverlayRef.hostNativeElementRef, {
        subject: '/image/preview/crop'
      }).subscribe((overlayRef) => {
            if(!this.imageOverlayRef) {
              this.imageOverlayRef = overlayRef;
            }
          },
          () => {},
          () => {
            if(!this.imageOverlayRef) {
              this.overlayDispatcher.createOverlay(this.toolbarOverlayRef.hostNativeElementRef, {
                subject: '/image/preview/crop',
                component: ImageCropComponent,
                classes: ['default-overlay-blank'],
                zIndex: 2
              }).pipe(filter(overlayRef => overlayRef.subject === '/image/preview/crop'))
                .subscribe((overlayRef) => {
                  this.imageOverlayRef = overlayRef;
                });
            }
          });
    }
  }
}
