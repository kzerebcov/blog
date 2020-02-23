import {
  Component,
  ComponentFactoryResolver, ComponentRef,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  Type,
  ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import {OverlayConfiguration} from "./overlay-dispatcher.service";

@Component({
  selector: 'app-overlay',
  template: '',
  styleUrls: ['./overlay.component.css'],
  encapsulation: ViewEncapsulation.None  // Use to disable CSS Encapsulation for this component
})
export class OverlayComponent implements OnInit {
  @Input() template: TemplateRef<any>;

  public targetComponentRef;
  public targetNativeElement;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() { }

  public initiate(targetComponent: Type<any>, overlayRef: OverlayConfiguration) {
    this.viewContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(targetComponent);
    this.targetComponentRef = this.viewContainer.createComponent(componentFactory);
    this.targetNativeElement = this.renderer.createElement('DIV');
    this.renderer.appendChild(this.targetNativeElement, this.targetComponentRef.location.nativeElement);
    this.renderer.appendChild(this.elementRef.nativeElement, this.targetNativeElement);
    overlayRef.targetComponentRef = this.targetComponentRef;
    overlayRef.targetNativeElementRef = this.targetComponentRef.location.nativeElement;
  }
}
