import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ResizableState } from '../../../overlay/resizable.directive';
import { OverlayDispatcherService } from '../../../overlay/overlay-dispatcher.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-image-crop',
  template: `<ng-template [appResizable] (onStateChanged)="updateCrop($event)"><div style="width: 100%; height: 100%; border: 1px yellowgreen solid; outline: rgba(255, 255, 275, 0.5) 100vw solid;" (dblclick)="crop()"></div></ng-template>`,
  styles: []
})
export class ImageCropComponent {
  private overlayRef: any = null;
  private cropPosition: any = null;

  @Input() imageData: string;
  @Output() croppedImage: EventEmitter<string> = new EventEmitter<string>();

  constructor(private overlayDispatcherService: OverlayDispatcherService) {
    this.overlayDispatcherService.$overlayDispatcher.pipe(
      filter(overlayRef => overlayRef.action.match('CREATE|UPDATE') != null),
      filter(overlayRef => overlayRef.subject === '/image/preview/crop'))
      .subscribe((overlayRef) => {
        this.overlayRef = overlayRef ? overlayRef : null;
      });
  }

  updateCrop(event) {
    if (event.state !== ResizableState.Resizing) {
      this.cropPosition = event.position;
    }
  }

  private cropToBase64(cropCanvas: HTMLCanvasElement): string {
    return cropCanvas.toDataURL();
  }

  private crop() {
    if (this.cropPosition) {
      const cropImage = new Image();
      const cropCanvas = document.createElement('canvas') as HTMLCanvasElement;
      cropCanvas.width = this.cropPosition.width;
      cropCanvas.height = this.cropPosition.height;
      const context = cropCanvas.getContext('2d');
      cropImage.onload = () => {
        if (context) {
          context.drawImage(
            cropImage,
            this.cropPosition.left,
            this.cropPosition.top,
            this.cropPosition.width,
            this.cropPosition.height,
            0, 0,
            this.cropPosition.width,
            this.cropPosition.height
          );
          this.croppedImage.emit(this.cropToBase64(cropCanvas));
        }
      };
      cropImage.src = this.imageData;
    }
  }
}
