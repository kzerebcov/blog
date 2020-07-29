import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  ViewChild,
  Renderer2
} from '@angular/core';
import {OverlayConfiguration, OverlayDispatcherService} from "../../../overlay/overlay-dispatcher.service";
import {PopupMessageComponent} from "../popup-message.component";
import {ImageToolbarComponent} from "./image-toolbar.component";
import {filter} from "rxjs/operators";
import {ImageCropComponent} from "./image-crop.component";

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
export class ImageLayoutComponent implements OnInit, AfterViewInit {
  ImageLayoutView: typeof ImageLayoutView = ImageLayoutView;
  view: ImageLayoutView = ImageLayoutView.Upload;

  @Input() imageData: string;
  @Output() change: EventEmitter<ImageData> = new EventEmitter<ImageData>();
  @ViewChild('imageLayoutContent', { static: false }) imageLayoutContent: ElementRef;
  @ViewChild('imagePreviewContainer', { static: false }) imagePreviewContainer: ElementRef;

  private imageToolbar = false;
  private overlayRef: OverlayConfiguration = null;
  private imageContainer: any = {
    style: '',
    url: '',
    alt: ''
  };

  constructor(private overlayDispatcherService: OverlayDispatcherService, private elementRef: ElementRef, private renderer: Renderer2) {
    this.overlayDispatcherService.$overlayDispatcher.pipe(
        filter((overlayRef) => overlayRef.action === 'CREATE'),
        filter((overlayRef) => overlayRef.subject === '/image/preview/crop')
      ).subscribe((overlayRef) => {
        (overlayRef.targetComponentRef.instance as ImageCropComponent).imageData = this.imageData;
        (overlayRef.targetComponentRef.instance as ImageCropComponent).croppedImage.subscribe((croppedImage) => {
          this.overlayDispatcherService.deleteOverlay(overlayRef);
          this.setImage(croppedImage);
        });
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    ['mousemove'].forEach((eventName) => {
      this.renderer.listen(
        'window',
        eventName,
        (evt) => this.mouseGlobalEventHandler(evt));
    });
  }

  setImage(imageData: string) {
    console.log('SETTING IMAGE!');
    this.imageData = imageData;
    this.imageContainer = {
      url: this.imageData,
      style: '',
      alt: ''
    };
  }

  mouseGlobalEventHandler(mouseEvent) {
    if (this.view === ImageLayoutView.Preview) {
      mouseEvent.preventDefault();
      const rect = this.imagePreviewContainer.nativeElement.getBoundingClientRect();
      this.imageToolbar = (rect.x < mouseEvent.x && mouseEvent.x < (rect.x + rect.width)
        && rect.y < mouseEvent.y && mouseEvent.y < (rect.y + rect.height)) ?
        (this.imageToolbar ? true : this.showToolbar()) :
        (this.imageToolbar ? this.hideToolbar() : false);
    }
  }

  toolbarActionHandler(imageToolbarAction) {
    console.log(imageToolbarAction);
  }

  showToolbar() {
    if (!this.overlayRef) {
      this.overlayDispatcherService.createOverlay(this.imagePreviewContainer.nativeElement, {
        subject: '/image/preview/toolbar',
        component: ImageToolbarComponent,
        position: { top: 20, left: 20 },
        classes: [],
        wrap: true,
        zIndex: 3
      }).pipe(
        filter(overlayRef => overlayRef.action.match('CREATE|UPDATE') != null),
        filter(overlayRef => overlayRef.subject === '/image/preview/toolbar')
      ).subscribe((overlayRef) => {
          this.overlayRef = overlayRef;
          (this.overlayRef.targetComponentRef.instance as ImageToolbarComponent).toolbarAction.subscribe(this.toolbarActionHandler);
      });
    }
    return true;
  }

  hideToolbar() {
    if (this.overlayRef) {
      this.overlayDispatcherService.deleteOverlay(this.overlayRef);
      this.overlayRef = null;
    }
    return false;
  }

  changeView(view: ImageLayoutView) {
    this.imageContainer.url && this.imageContainer.url ? this.view = view : this.view = ImageLayoutView.Upload;
  }

  updateLoadStatus(status: any) {
    if(status.loading) {
      this.showPopupMessage('Loading data...');
    }
  }

  test(y): void {
    console.log('UPDATE-TEST');
    console.log(y);
    this.overlayDispatcherService.updateOverlay(y);
  }

  showPopupMessage(message: string) {
    console.log('POPUP MESSAGE: ' + message);
    this.overlayDispatcherService.createOverlay(this.imageLayoutContent.nativeElement, {
      component: PopupMessageComponent,
      classes: ['popup-message-overlay'],
      position: { left: 'center' }
    }).subscribe(
        (overlayConfigurationRef) => {
          console.log("NEXT");
        },
        () => { console.log("ERROR"); },
        () => { console.log("COMPLETE"); }
      );
  }
}
