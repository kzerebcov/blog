import {Component, ComponentFactoryResolver, Injector, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-image-layout-overlay',
  templateUrl: './image-layout-overlay.component.html',
  styleUrls: ['./image-layout-overlay.component.css']
})
export class ImageLayoutOverlayComponent implements OnInit {


  constructor() { }

  currentId: string;
  overlayHandlerCallback(overlayDetailRef): void {
    console.log('image-layout-component!!!');
    console.log(overlayDetailRef);
    this.currentId = overlayDetailRef.id;
    console.log('image-layout-component / first id: ' + this.currentId);
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
