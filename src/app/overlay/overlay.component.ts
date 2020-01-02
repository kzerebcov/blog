import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-overlay',
  template: '',
  styles: []
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

  public initiate(targetComponent: Type<any>) {
    this.viewContainer.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(targetComponent);
    this.targetComponentRef = this.viewContainer.createComponent(componentFactory);
    this.targetNativeElement = this.renderer.createElement('DIV');
    this.renderer.appendChild(this.targetNativeElement, this.targetComponentRef.location.nativeElement);
    this.renderer.appendChild(this.elementRef.nativeElement, this.targetNativeElement);
  }
}
