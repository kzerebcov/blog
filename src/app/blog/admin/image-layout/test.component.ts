import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewEncapsulation} from '@angular/core';
import {ImageLayoutOverlayComponent} from './image-layout-overlay/image-layout-overlay.component';

@Component({
  selector: 'app-test',
  template: `
    <div *appOverlay>
      <button (click)="test($event)">Test1!</button>
      <button (click)="test2($event)">Test2: {{this.currentId}}</button>
      <button (click)="test3($event)">Fixed</button>
    </div>
  `,
  styleUrls: ['./test.component.css'],
  encapsulation: ViewEncapsulation.None  // Use to disable CSS Encapsulation for this component
})
export class TestComponent implements OnInit {
  @Input() customEventName: string;
  @Output() testEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private renderer: Renderer2
  ) {}

  currentId: string;
  overlayHandlerCallback(overlayDetailRef): void {
    console.log(overlayDetailRef);
    this.currentId = overlayDetailRef.id;
    console.log('first id: ' + this.currentId);

    // TODO: Target native element resizable.
    //console.log('callback');
    //console.log(overlayDetailRef.hostNativeElementRef);
    //this.renderer.setAttribute(overlayDetailRef.hostNativeElementRef, '*appResizable', '');
  }

  emitEvent(event) {
    event.target.dispatchEvent(new CustomEvent('overlayEvent',
      {
        bubbles: true,
        detail: {
          action: 'create',
          component: ImageLayoutOverlayComponent,
          self: this,
          zIndex: 1000,
          position: {
            width: '150%',
            height: '150%',
            top: 'center',
            left: 'center'
          }
        }
      }));
  }

  emitEvent2(event, id) {
    console.log('emitted id: ' + id);
    event.target.dispatchEvent(new CustomEvent('overlayEvent',
      {
        bubbles: true,
        detail: {
          id: id,
          subject: '/test/message/X',
          action: 'update',
          component: ImageLayoutOverlayComponent,
          //classes: ['test-component-backdrop'],
          self: this,
          position: { width: '50%', top: '20px', right: 0 }
        }
      }));
  }

  emitEvent3(event) {
    event.target.dispatchEvent(new CustomEvent('overlayEvent',
      {
        bubbles: true,
        detail: {
          window: true,
          zIndex: 2000,
          action: 'create',
          component: ImageLayoutOverlayComponent,
          //classes: ['test-component-backdrop'],
          self: this,
          position: { width: '100%', height: '100%', left: 0, top: 0 }
        }
      }));
  }

  ngOnInit() { }

  test(event) {
    this.emitEvent(event);
  }

  test2(event) {
    this.emitEvent2(event, this.currentId);
  }

  test3(event) {
    this.emitEvent3(event);
  }
}
