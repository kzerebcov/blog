import {Component, ComponentFactoryResolver, Injector, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-image-layout-overlay',
  templateUrl: './image-layout-overlay.component.html',
  styleUrls: ['./image-layout-overlay.component.css']
})
export class ImageLayoutOverlayComponent implements OnInit {
  constructor() { }

  private currentId: string = '';
  overlayHandlerCallback(overlayDetailRef): void {
    this.currentId = overlayDetailRef.id;
  }

  test(e) {
    console.log('test pressed...');
    event.target.dispatchEvent(new CustomEvent('overlayEvent',
      {
        bubbles: true,
        detail: {
          id: this.currentId,
          subject: '/test/message/X',
          action: 'delete',
        }
      }));
  }

  ngOnInit() {

  }
}
