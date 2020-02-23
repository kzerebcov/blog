import {Injectable, Renderer2} from '@angular/core';
import { Observable } from "rxjs";

export interface OverlaySubscriber {

}

export interface OverlayConfiguration {
  id?: string,
  action?: string,
  component?: any,
  window?: boolean,
  multilayer?: boolean,
  classes?: any[],
  self?: any,
  subject?: string,
  targetComponentRef?: any,
  hostNativeElementRef?: any,
  overlayNativeElementRef?: any,
  targetNativeElementRef?: any,
  zIndex?: number,
  position?: {
    top?: any,
    left?: any,
    width?: any,
    height?: any
  }
}

@Injectable({
  providedIn: 'root'
})
export class OverlayDispatcherService {
  constructor() { }
  wrapComponentBoundingRect(overlayConfigurationRef: OverlayConfiguration): void {
      let rect = overlayConfigurationRef.targetNativeElementRef.firstChild.getBoundingClientRect();
      if(!overlayConfigurationRef.position) {
        overlayConfigurationRef.position = {};
        overlayConfigurationRef.position.left = 'center';
        overlayConfigurationRef.position.top = 0;
      }
      overlayConfigurationRef.position.width = rect.width;
      overlayConfigurationRef.position.height = rect.height;
      this.updateOverlay(overlayConfigurationRef);
  }

  createOverlay(targetNativeElementRef: any, overlayConfigurationRef: OverlayConfiguration) {
    return new Observable<OverlayConfiguration>(
      (observer) => {
        const handler = (overlayConfigurationRef) => {
          observer.next(overlayConfigurationRef);
          if(overlayConfigurationRef.action.toUpperCase() === 'DELETE') {
            observer.complete();
          }
        };
        overlayConfigurationRef.action = 'CREATE';
        overlayConfigurationRef.self = { overlayHandlerCallback: handler };
        targetNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
          {
            bubbles: true,
            detail: overlayConfigurationRef
          }));
      }
    );
  }

  readOverlay(targetNativeElementRef: any, overlayConfigurationRef: OverlayConfiguration) {
    return new Observable<OverlayConfiguration>(
      (observer) => {
        const handler = (overlayConfigurationRef = null) => {
          if(overlayConfigurationRef) {
            observer.next(overlayConfigurationRef);
          } else {
            observer.complete();
          }
        };
        overlayConfigurationRef.action = 'READ';
        overlayConfigurationRef.self = { overlayReadCallback: handler };
        targetNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
          {
            bubbles: true,
            detail: overlayConfigurationRef
          }));
      }
    );
  }

  updateOverlay(overlayConfigurationRef: OverlayConfiguration) {
    if(overlayConfigurationRef.id && overlayConfigurationRef.hostNativeElementRef) {
      overlayConfigurationRef.action = 'UPDATE';
      overlayConfigurationRef.hostNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: overlayConfigurationRef
        }));
    }
  }

  deleteOverlay(overlayConfigurationRef: OverlayConfiguration) {
    if(overlayConfigurationRef.id && overlayConfigurationRef.hostNativeElementRef) {
      overlayConfigurationRef.action = 'DELETE';
      overlayConfigurationRef.hostNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: overlayConfigurationRef
        }));
    }
  }
}
