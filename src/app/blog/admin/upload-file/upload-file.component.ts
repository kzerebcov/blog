import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Component, EventEmitter, Output} from '@angular/core';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

export interface FileInfo {
  url: string
}

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {
  @Output() base64FileLoaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  url = '';
  files: any = [];
  base64File = null;

  getImage(imageUrl: string): Observable<Blob> {
    console.log('here...');
    return this.http.get(imageUrl, { observe: 'response', responseType: 'blob' }).map((res) => res.body);
  }

  uploadUrl(url) {
    this.getImage(url).subscribe(
      (data: Blob) => {
        this.loadBase64File(data);
      },
      (error) => {
        console.log(error.toString());
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
}
