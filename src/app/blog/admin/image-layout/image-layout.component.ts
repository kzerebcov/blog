import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

export interface ImageLayout {
  url: string,
  alt: string,
  style: string
}

export enum ImageLayoutView {
  Upload,
  Preview,
  Settings
}

@Component({
  selector: 'app-image-layout',
  templateUrl: './image-layout.component.html',
  styleUrls: ['./image-layout.component.css']
})
export class ImageLayoutComponent implements OnInit {

  ImageLayoutView: typeof ImageLayoutView = ImageLayoutView;
  view: ImageLayoutView = ImageLayoutView.Upload;

  @Input() imageLayout: ImageLayout;
  @Output() change: EventEmitter<ImageLayout> = new EventEmitter<ImageLayout>();
  @ViewChild('imageLayoutContent', { static: false }) imageLayoutContent: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  changeView(view: ImageLayoutView) {
    this.imageLayout.url && this.imageLayout.url ? this.view = view : this.view = ImageLayoutView.Upload;
  }

  declaredHandler(evt) {
    console.log('declated event handler... : ' + evt.detail.toString());
  }
}
