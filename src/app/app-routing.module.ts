import { NgModule } from '@angular/core';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './blog/post/post.component';
import { Route, RouterModule, Routes, UrlSegment, UrlSegmentGroup } from '@angular/router';
import {FlexDemoComponent} from './blog/flex-demo/flex-demo.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
  },
  {
    path: 'posts',
    component: BlogComponent,
  },
  {
    path: 'demo',
    component: FlexDemoComponent,
  },
  {
    path: ':slug',
    component: PostComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
  ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }]
})
export class AppRoutingModule { }
