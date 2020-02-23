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

  @Input() imageData: Blob;
  @Output() change: EventEmitter<ImageData> = new EventEmitter<ImageData>();
  @ViewChild('imageLayoutContent', { static: false }) imageLayoutContent: ElementRef;
  @ViewChild('imagePreviewContainer', { static: false }) imagePreviewContainer: ElementRef;

  private imageToolbar: OverlayConfiguration = null;
  private imageContainer: any = {
    style: '',
    url: '',
    alt: ''
  }

  constructor(private overlayDispatcher: OverlayDispatcherService, private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit() {
    ['mousemove'].forEach((eventName) => {
      this.renderer.listen(
        'window',
        eventName,
        (evt) => this.mouseGlobalEventHandler(evt));
    });
  }

  setImage(imageData: Blob) {
    this.imageData = imageData;
    this.imageContainer = {
      url: this.imageData,
      style: '',
      alt: ''
    }
  }

  mouseGlobalEventHandler(mouseEvent) {
    if(this.view == ImageLayoutView.Preview) {
      mouseEvent.preventDefault();
      const rect = this.imagePreviewContainer.nativeElement.getBoundingClientRect();
      if(rect.x < mouseEvent.x && mouseEvent.x < (rect.x + rect.width)
        && rect.y < mouseEvent.y && mouseEvent.y < (rect.y + rect.height)) {
        this.showImageToolbar();
      } else {
        this.hideImageToolbar();
      }
    }
  }

  toolbarActionHandler(imageToolbarAction) {
    console.log(imageToolbarAction);
  }

  showImageToolbar() {
    if(!this.imageToolbar) {
      this.overlayDispatcher.createOverlay(this.imagePreviewContainer.nativeElement, {
        subject: '/image/preview/toolbar',
        classes: ['default-overlay-blank'],
        component: ImageToolbarComponent,
        position: { top: 20, left: 20 },
        zIndex: 3
      }).pipe(filter(overlayRef => overlayRef.subject === '/image/preview/toolbar'))
        .subscribe((overlayRef) => {
        this.imageToolbar = overlayRef;
        const targetComponentRef: ImageToolbarComponent = this.imageToolbar.targetComponentRef.instance;
        targetComponentRef.imageData = this.imageData;
        targetComponentRef.toolbarAction.subscribe((e) => {
          this.toolbarActionHandler(e);
        });
      });
    }
  }

  hideImageToolbar() {
    if(this.imageToolbar) {
      this.overlayDispatcher.deleteOverlay(this.imageToolbar);
      this.imageToolbar = null;
    }
  }

  showImageCrop() {

  }

  hideImageCrop() {

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
    this.overlayDispatcher.updateOverlay(y);
  }

  showPopupMessage(message: string) {
    console.log('POPUP MESSAGE: ' + message);
    this.overlayDispatcher.createOverlay(this.imageLayoutContent.nativeElement, {
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
