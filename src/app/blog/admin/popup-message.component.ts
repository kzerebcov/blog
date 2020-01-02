import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {OverlayConfiguration, OverlayDispatcherService} from "../../overlay/overlay-dispatcher.service";

@Component({
  selector: 'app-popup-message',
  template: `
    <div>
        <p style="display: inline">
            popup-message works!
            &nbsp;
            <a href="#" (click)="close()">Dismiss</a>
        </p>
    </div>
  `,
  styles: [
    `.popup-message-overlay {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          background-color: #4f8fff;
      }`
  ],
  encapsulation: ViewEncapsulation.None
})
export class PopupMessageComponent implements OnInit {
  constructor(private overlayDispatcher: OverlayDispatcherService, private e: ElementRef) { }
  ngOnInit() {}

  private rect: any = null;
  private oc: any = null;

  overlayHandlerCallback(overlayConfigurationRef: OverlayConfiguration): void {
    this.oc = overlayConfigurationRef;

    console.log(overlayConfigurationRef.overlayNativeElementRef);

    if(!this.rect) {
      this.rect = this.e.nativeElement.getBoundingClientRect();
      overlayConfigurationRef.position = {};
      overlayConfigurationRef.position.width = this.rect.width;
      overlayConfigurationRef.position.height = this.rect.height;
      overlayConfigurationRef.position.left = 'center';
      overlayConfigurationRef.position.top = 0;
      overlayConfigurationRef.classes = ['popup-message-overlay'];
      this.overlayDispatcher.updateOverlay(overlayConfigurationRef.overlayNativeElementRef, overlayConfigurationRef);
    }
  }

  close() {
    this.overlayDispatcher.deleteOverlay(this.oc.overlayNativeElementRef, this.oc);
  }
}
