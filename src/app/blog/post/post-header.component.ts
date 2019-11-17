import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../../api.service';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.css']
})
export class PostHeaderComponent implements OnInit {
  @Input() post: Post;
  constructor() {}
  ngOnInit() {}
}
