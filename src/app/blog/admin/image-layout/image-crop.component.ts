import { Component, OnInit, Input } from '@angular/core';
import {ResizableBorder, ResizableState} from "../../../overlay/resizable.directive";

export interface ImageCroppedEvent {
  base64?: string | null;
  file?: Blob | null;
  width: number;
  height: number;
  cropperPosition: CropperPosition;
  imagePosition: CropperPosition;
  offsetImagePosition?: CropperPosition;
}

export interface CropperPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-image-crop',
  template: `
      <ng-template [appResizable] (onStateChanged)="update($event)">
        <div style="width: 100%; height: 100%; border: 1px yellowgreen solid; outline: rgba(255, 255, 275, 0.5) 100vw solid;"></div>
      </ng-template>
  `,
  styles: []
})
export class ImageCropComponent implements OnInit {

  constructor() { }
  @Input() imageData: Blob;
  @Input() cropper: CropperPosition = {
    x1: -100,
    y1: -100,
    x2: 10000,
    y2: 10000
  };

  ngOnInit() {}

  update(event) {
    //if(event.state !== ResizableState.Resizing) {
    //    console.log(event);
    //}
  }

  private cropToBase64(cropCanvas: HTMLCanvasElement): string {
    return cropCanvas.toDataURL('image/' + this.format, this.getQuality());
  }

  private getImagePosition(): CropperPosition {
    const sourceImageElement = this.sourceImage.nativeElement;
    const ratio = this.transformedSize.width / sourceImageElement.offsetWidth;

    const out: CropperPosition = {
      x1: Math.round(this.cropper.x1 * ratio),
      y1: Math.round(this.cropper.y1 * ratio),
      x2: Math.round(this.cropper.x2 * ratio),
      y2: Math.round(this.cropper.y2 * ratio)
    };

    if (!this.containWithinAspectRatio) {
      out.x1 = Math.max(out.x1, 0);
      out.y1 = Math.max(out.y1, 0);
      out.x2 = Math.min(out.x2, this.transformedSize.width);
      out.y2 = Math.min(out.y2, this.transformedSize.height);
    }

    return out;
  }

  crop(): ImageCroppedEvent | null {
    //if (this.sourceImage && this.sourceImage.nativeElement && this.transformedImage != null) {
      //this.startCropImage.emit();
      const imagePosition = this.getImagePosition();
      const width = imagePosition.x2 - imagePosition.x1;
      const height = imagePosition.y2 - imagePosition.y1;

      const cropCanvas = document.createElement('canvas') as HTMLCanvasElement;
      cropCanvas.width = width;
      cropCanvas.height = height;

      const ctx = cropCanvas.getContext('2d');
      if (ctx) {
        if (this.backgroundColor != null) {
          ctx.fillStyle = this.backgroundColor;
          ctx.fillRect(0, 0, width, height);
        }

        const scaleX = (this.transform.scale || 1) * (this.transform.flipH ? -1 : 1);
        const scaleY = (this.transform.scale || 1) * (this.transform.flipV ? -1 : 1);

        ctx.setTransform(scaleX, 0, 0, scaleY, this.transformedSize.width / 2, this.transformedSize.height / 2);
        ctx.translate(-imagePosition.x1 / scaleX, -imagePosition.y1 / scaleY);
        ctx.rotate((this.transform.rotate || 0) * Math.PI / 180);
        ctx.drawImage(this.transformedImage, -this.transformedSize.width / 2, -this.transformedSize.height / 2);

        const output: ImageCroppedEvent = {
          width, height,
          imagePosition,
          cropperPosition: {...this.cropper}
        };
        if (this.containWithinAspectRatio) {
          output.offsetImagePosition = this.getOffsetImagePosition();
        }
        const resizeRatio = this.getResizeRatio(width, height);
        /*if (resizeRatio !== 1) {
          output.width = Math.round(width * resizeRatio);
          output.height = this.maintainAspectRatio
            ? Math.round(output.width / this.aspectRatio)
            : Math.round(height * resizeRatio);
          resizeCanvas(cropCanvas, output.width, output.height);
        }*/
        output.base64 = this.cropToBase64(cropCanvas);
        this.imageCropped.emit(output);
        return output;
      }
    //}
    return null;
  }
}
