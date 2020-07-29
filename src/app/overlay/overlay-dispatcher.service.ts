import {Injectable, Renderer2} from '@angular/core';
import { Observable } from 'rxjs';
import {filter, tap} from "rxjs/operators";

export interface OverlayConfiguration {
  id?: string;
  action?: string;
  component?: any;
  properties?: any;
  window?: boolean;
  multilayer?: boolean;
  wrap?: boolean;
  wrapped?: boolean;
  classes?: any[];
  self?: any;
  subject?: string;
  targetComponentRef?: any;
  hostNativeElementRef?: any;
  overlayNativeElementRef?: any;
  targetNativeElementRef?: any;
  zIndex?: number;
  position?: {
    top?: any,
    left?: any,
    width?: any,
    height?: any
  };
}

@Injectable({
  providedIn: 'root'
})
export class OverlayDispatcherService {
  dispatcherObservers = [];
  $overlayDispatcher: Observable<OverlayConfiguration> = new Observable<OverlayConfiguration>((observer) => {
    this.dispatcherObservers.push(observer);
    const parent = this;
    return {
      unsubscribe() {
        console.log(parent);
        console.log('DO1');
        parent.dispatcherObservers.splice(parent.dispatcherObservers.indexOf(observer), 1);
        console.log('DO2');
      }
    };
  });

  constructor() {}

  wrapComponent(overlayConfigurationRef: OverlayConfiguration): void {
      const rect = overlayConfigurationRef.targetNativeElementRef.firstChild.getBoundingClientRect();
      if (!overlayConfigurationRef.position) {
        overlayConfigurationRef.position = {};
        overlayConfigurationRef.position.left = 'center';
        overlayConfigurationRef.position.top = 0;
      }
      overlayConfigurationRef.position.width = rect.width;
      overlayConfigurationRef.position.height = rect.height;
      this.updateOverlay(overlayConfigurationRef);
  }

  modifyOverlay(overlayConfigurationRef: OverlayConfiguration): void {
    if (overlayConfigurationRef.wrap && !overlayConfigurationRef.wrapped) {
      overlayConfigurationRef.wrapped = true;
      this.wrapComponent(overlayConfigurationRef);
    }
  }

  createOverlay(targetNativeElementRef: any, overlayConfigurationRef: OverlayConfiguration) {
    return new Observable<OverlayConfiguration>(
      (observer) => {
        const handler = (overlayRef) => {
          observer.next(overlayRef);
          if (overlayRef.action.toUpperCase() === 'DELETE') {
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
    ).pipe(tap((overlayRef) => {
      this.modifyOverlay(overlayRef);
      this.dispatcherObservers.forEach((observer) => {
        observer.next(overlayRef);
      });
    }));
  }

  readOverlay(targetNativeElementRef: any, overlayConfigurationRef: OverlayConfiguration) {
    return new Observable<OverlayConfiguration>(
      (observer) => {
        const handler = (overlayRef = null) => {
          if (overlayRef) {
            observer.next(overlayRef);
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
      });
  }

  updateOverlay(overlayConfigurationRef: OverlayConfiguration) {
    if (overlayConfigurationRef.id && overlayConfigurationRef.hostNativeElementRef) {
      overlayConfigurationRef.action = 'UPDATE';
      overlayConfigurationRef.hostNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: overlayConfigurationRef
        }));
    }
  }

  deleteOverlay(overlayConfigurationRef: OverlayConfiguration) {
    if (overlayConfigurationRef.id && overlayConfigurationRef.hostNativeElementRef) {
      overlayConfigurationRef.action = 'DELETE';
      overlayConfigurationRef.hostNativeElementRef.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: overlayConfigurationRef
        }));
    }
  }
}
