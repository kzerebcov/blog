import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLayoutComponent } from './image-layout.component';

describe('ImageLayoutComponent', () => {
  let component: ImageLayoutComponent;
  let fixture: ComponentFixture<ImageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
