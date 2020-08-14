import {Component, Input, OnInit} from '@angular/core';
import {ApiService, Post} from '../../api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  private slug;
  @Input() post: Post;

  /*
    TODO: Validate data structure/schema of 'post' object
    TODO: Emit events to reflect empty, loading and rendered state
    TODO: Implement indicators of intermediate state
  */

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.slug && !this.post) {
        // Load page via :slug parameter supplied by the router, otherwise
        // render page locally using data supplier via '@Input() post'...
        this.slug = params.slug;
        this.loadPost();
      }
    });
  }

  loadPost(): void {
    const api = 'https://6o5oj7u1p5.execute-api.eu-central-1.amazonaws.com/prod/blog/';
    this.apiService.requestPost({}, api + String(this.slug))
      .subscribe(
        (response: Post) => {
          /* this function is executed every time there's a new output */
          console.log('VALUE RECEIVED: ' + JSON.stringify(response));

          if (typeof(response.article) === 'string') {
            response.article = [{
              type: 'paragraph',
              url: '',
              alt: '',
              text: response.article,
              subtitle: '',
              css: ''
            }];
          }

          this.post = response;
        },
        (err) => {
          /* this function is executed when there's an ERROR */
          console.log('ERROR: ' + JSON.stringify(err));
        },
        () => {
          /* this function is executed when the observable ends (completes) its stream */
          console.log('COMPLETED');
        });
  }
}
