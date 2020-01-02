import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Component, ElementRef, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { PopupMessageComponent } from "../popup-message.component";
import {OverlayConfiguration} from "../../../overlay/overlay-dispatcher.service";
import {ImageLayoutComponent} from "../image-layout/image-layout.component";
import {ImageLayoutOverlayComponent} from "../image-layout/image-layout-overlay/image-layout-overlay.component";

export interface FileInfo {
  url: string
}

function base64ToBlob(b64Data, contentType='', sliceSize=512) {
  const byteArrays = [];
  const byteCharacters = atob(b64Data);
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, {type: contentType});
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  private eventSourceNativeElementRef: any = null;
  @Output() base64FileLoaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateLoadStatus: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  url = '';
  files: any = [];
  base64File = null;
  requestDataAPI = 'https://6o5oj7u1p5.execute-api.eu-central-1.amazonaws.com/prod/admin/request-data?url=';
  loading: boolean = false;
  eventSource: any = null;

  /*
  getImage(imageUrl: string): Observable<Blob> {
    console.log('here...');
    return this.http.get(imageUrl, { observe: 'response', responseType: 'blob' }).map((res) => res.body);
  }
   */

  getImage(imageUrl: string): Observable<any> {
    console.log(btoa(imageUrl));
    this.loading = true;
    this.updateLoadStatus.emit({ loading: true });
    return this.http.get(this.requestDataAPI + btoa(imageUrl), {observe: 'response'}).map((res) => res.body);
  }

  /*uploadUrl(url) {
    this.getImage(url).subscribe(
      (data: Blob) => {
        this.loadBase64File(data);
      },
      (error) => {
        console.log(error.toString());
      }
    );
  }*/

  uploadUrl(url) {
    this.getImage(url).subscribe(
      (base64Image: any) => {
        console.log(JSON.stringify(base64Image.contentType));
        console.log(JSON.stringify(base64Image.data));
        this.loadBase64File(base64ToBlob(base64Image.data, base64Image.contentType));
        this.loading = false;
        this.updateLoadStatus.emit({ loading: false });
      },
      (error) => {
        console.log(error.toString());
        this.loading = false;
        this.updateLoadStatus.emit({ loading: false });
      }
    );
  }

  uploadFile(files) {
    this.loadBase64File(files[0]);
  }

  loadBase64File(blobFile) {
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.base64File = fileReader.result;
      this.base64FileLoaded.emit(this.base64File);
    }

    fileReader.readAsDataURL(blobFile);
  }

  deleteAttachment(index) {
    this.files.splice(index, 1);
  }

  /*
    emitEvent(event) {
      event.target.dispatchEvent(new CustomEvent('overlayEvent',
        {
          bubbles: true,
          detail: {
            action: 'create',
            component: PopupMessageComponent,
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
  } */

}

/*

currentId: string;
  overlayHandlerCallback(overlayDetailRef): void {
    console.log(overlayDetailRef);
    this.currentId = overlayDetailRef.id;
    console.log('first id: ' + this.currentId);
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

 */
