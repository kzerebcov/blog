import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() onUrlDropped = new EventEmitter<string>();
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.background-color') private background = '#f5fcff';
  @HostBinding('style.opacity') private opacity = '1';

  //
  // Dragover listener
  //
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#9ecbec';
    this.opacity = '0.8';
  }

  //
  // Dragleave listener
  //
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';
  }

  //
  // Drop listener
  //
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#f5fcff';
    this.opacity = '1';

    if (evt.dataTransfer.getData('URL') && evt.dataTransfer.getData('text/html')) {
      let parser = new DOMParser();
      let parsedHtml = parser.parseFromString(evt.dataTransfer.getData('text/html'), 'text/html');
      let imageUrl = parsedHtml.images[0].src;
      this.onUrlDropped.emit(imageUrl);
    } else if (evt.dataTransfer.files && evt.dataTransfer.files.length) {
      this.onFileDropped.emit(evt.dataTransfer.files);
    } else {
      // TODO: Pop error message...
    }
  }
}
