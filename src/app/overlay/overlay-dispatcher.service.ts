import { Injectable } from '@angular/core';
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
  hostNativeElementRef?: any,
  overlayNativeElementRef?: any,
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

  updateOverlay(targetNativeElementRef: any, overlayConfigurationRef: OverlayConfiguration) {
    if(overlayConfigurationRef.id) {
      overlayConfigurationRef.action = 'UPDATE';
      targetNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: overlayConfigurationRef
        }));
    }
  }

  deleteOverlay(targetNativeElementRef: any, overlayConfigurationRef: OverlayConfiguration) {
    if(overlayConfigurationRef.id) {
      overlayConfigurationRef.action = 'DELETE';
      targetNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: overlayConfigurationRef
        }));
    }
  }
}
