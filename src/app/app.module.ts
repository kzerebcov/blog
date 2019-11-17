import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './blog/post/post.component';
import { BlogAdminComponent } from './blog/admin/blog-admin.component';
import { PostHeaderComponent } from './blog/post/post-header.component';
import { DragDropDirective } from './blog/admin/upload-file/drag-drop.directive';
import { UploadFileComponent } from './blog/admin/upload-file/upload-file.component';
import { ImageLayoutComponent } from './blog/admin/image-layout/image-layout.component';
import { OverlayComponent } from './overlay/overlay.component';
import { OverlayDirective } from './overlay/overlay.directive';
import { ImageLayoutOverlayComponent } from './blog/admin/image-layout/image-layout-overlay/image-layout-overlay.component';
import { TestComponent } from './blog/admin/image-layout/test.component';
import { WrapperContainerComponent } from './overlay/wrapper-container.component';
import { WrapperDirective } from './overlay/wrapper.directive';
import { ResizableDirective } from './blog/resizable.directive';
import { FlexDemoComponent } from './blog/flex-demo/flex-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    PostComponent,
    BlogAdminComponent,
    PostHeaderComponent,
    UploadFileComponent,
    DragDropDirective,
    ImageLayoutComponent,
    OverlayComponent,
    OverlayDirective,
    ImageLayoutOverlayComponent,
    TestComponent,
    WrapperContainerComponent,
    WrapperDirective,
    ResizableDirective,
    FlexDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApiService, HttpClient],
  bootstrap: [AppComponent],
  entryComponents: [OverlayComponent, WrapperContainerComponent, ImageLayoutOverlayComponent]
})
export class AppModule { }
