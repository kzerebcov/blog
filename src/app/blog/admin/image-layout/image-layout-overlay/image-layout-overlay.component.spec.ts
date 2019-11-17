import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLayoutOverlayComponent } from './image-layout-overlay.component';

describe('ImageLayoutOverlayComponent', () => {
  let component: ImageLayoutOverlayComponent;
  let fixture: ComponentFixture<ImageLayoutOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLayoutOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLayoutOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
