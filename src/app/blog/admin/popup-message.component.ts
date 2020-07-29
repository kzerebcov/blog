import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {OverlayConfiguration, OverlayDispatcherService} from "../../overlay/overlay-dispatcher.service";

@Component({
  selector: 'app-popup-message',
  template: `
    <div>
        <p style="display: inline-block">
            popup-message works!&nbsp;
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
  private overlayRef: OverlayConfiguration;
  constructor(private overlayDispatcher: OverlayDispatcherService, private e: ElementRef) { }
  ngOnInit() {}

  overlayHandlerCallback(overlayConfigurationRef: OverlayConfiguration): void {
    if(!this.overlayRef) {
      this.overlayRef = overlayConfigurationRef;
      this.overlayDispatcher.wrapComponent(overlayConfigurationRef);
    }
  }

  close() {
    this.overlayDispatcher.deleteOverlay(this.overlayRef);
  }
}
