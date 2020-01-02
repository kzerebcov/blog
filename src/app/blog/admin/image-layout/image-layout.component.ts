import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ImageLayoutOverlayComponent} from "./image-layout-overlay/image-layout-overlay.component";
import {OverlayDispatcherService} from "../../../overlay/overlay-dispatcher.service";
import {PopupMessageComponent} from "../popup-message.component";

export interface ImageLayout {
  url: string,
  alt: string,
  style: string
}

export enum ImageLayoutView {
  Upload,
  Preview,
  Settings
}

@Component({
  selector: 'app-image-layout',
  templateUrl: './image-layout.component.html',
  styleUrls: ['./image-layout.component.css']
})
export class ImageLayoutComponent implements OnInit {

  ImageLayoutView: typeof ImageLayoutView = ImageLayoutView;
  view: ImageLayoutView = ImageLayoutView.Upload;

  @Input() imageLayout: ImageLayout;
  @Output() change: EventEmitter<ImageLayout> = new EventEmitter<ImageLayout>();
  @ViewChild('imageLayoutContent', { static: false }) imageLayoutContent: ElementRef;

  constructor(private overlayDispatcher: OverlayDispatcherService, private elementRef: ElementRef) { }

  ngOnInit() {
  }

  changeView(view: ImageLayoutView) {
    this.imageLayout.url && this.imageLayout.url ? this.view = view : this.view = ImageLayoutView.Upload;
  }

  declaredHandler(evt) {
    console.log('declated event handler... : ' + evt.detail.toString());
  }

  updateLoadStatus(status: any) {
    if(status.loading) {
      this.showPopupMessage('Loading data...');
    }
  }

  test(y): void {
    console.log('UPDATE-TEST');
    console.log(y);
    this.overlayDispatcher.updateOverlay(this.imageLayoutContent.nativeElement, y);
  }

  showPopupMessage(message: string) {
    console.log('POPUP MESSAGE: ' + message);
    this.overlayDispatcher.createOverlay(this.imageLayoutContent.nativeElement, {
      component: PopupMessageComponent
    })
      .subscribe(
        (overlayConfigurationRef) => {
          console.log("NEXT");
        },
        () => { console.log("ERROR"); },
        () => { console.log("COMPLETE"); }
      );
  }
}
