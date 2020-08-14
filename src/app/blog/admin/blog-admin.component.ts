import {Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ApiResponse, ApiService, Blog, Part, Post} from '../../api.service';

@Component({
  selector: 'app-blog-admin',
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.css']
})
export class BlogAdminComponent implements OnInit {
  private editor: Editor = new Editor(this.apiService);
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.editor.change.subscribe((event) => {
      this.change.emit(event);
    });
  }

  @Input() post: Post;
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
}

export enum EditorView {
  New,
  Preview
}

export enum EditorAction {
  Ready,
  Loading,
  Loaded,
  Waiting,
  Success,
  Error
}

export class Editor {
  queue: Array<EditorBlock> = [];

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  focus = false;
  post: Post = {
    sortKey: 0,
    slug: '',
    header: {
      author: '',
      title: '',
      excerpt: ''
    },
    image: {
      url: '',
      alt: '',
      css: ''
    },
    article: []
  };

  EditorView: typeof EditorView = EditorView;
  view: EditorView = EditorView.New;

  EditorAction: typeof EditorAction = EditorAction;
  action: EditorAction = EditorAction.Ready;

  constructor(private apiService: ApiService) {
    this.queue.push(new EditorBlock('paragraph', true));
  }

  public removeBlock(target: number) {
    this.queue.splice(target, 1);
  }

  public moveUp(target: number) {
    if (target > 0) {
      const buffer = this.queue[target - 1];
      this.queue[target - 1] = this.queue[target];
      this.queue[target] = buffer;
    }
  }

  public moveDown(target: number) {
    if (target < this.queue.length - 1) {
      const buffer = this.queue[target + 1];
      this.queue[target + 1] = this.queue[target];
      this.queue[target] = buffer;
    }
  }

  setFocus(target: number) {
    for (let index = 0; index < this.queue.length; index++) {
      index === target ? this.queue[index].setFocus(true) : this.queue[index].setFocus(false);
    }
  }

  addImage() {
    this.focus = true;
    this.post.image = {
      width: 0,
      height: 0,
      url: '',
      alt: ''
    };

    this.post.image.url = 'http://via.placeholder.com/800x600/f1f1f1/aaa/?text=placeholder';
    this.post.image.alt = '[Image]';
  }

  public removeImage() {
    this.focus = false;
    this.post.image = {
      width: 0,
      height: 0,
      url: '',
      alt: ''
    };
  }

  public addItem(type: string) {
    this.queue.push(new EditorBlock(type));
    this.setFocus(this.queue.length - 1);
  }

  public updateSlug(title: string) {
    this.post.slug = this.makeSlug(title);
  }

  private makeSlug(str) {
    let from = "а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я ā ą ä á à â å č ć ē ę ě é è ê æ ģ ğ ö ó ø ǿ ô ő ḿ ŉ ń ṕ ŕ ş ü ß ř ł đ þ ĥ ḧ ī ï í î ĵ ķ ł ņ ń ň ř š ś ť ů ú û ứ ù ü ű ū ý ÿ ž ź ż ç є ґ".split(' ');
    var to =  "a b v g d e e zh z i y k l m n o p r s t u f h ts ch sh shch # y # e yu ya a a ae a a a a c c e e e e e e e g g oe o o o o o m n n p r s ue ss r l d th h h i i i i j k l n n n r s s t u u u u u u u u y y z z z c ye g".split(' ');

    str = str.toLowerCase();

    // remove simple HTML tags
    str = str.replace(/(<[a-z0-9\-]{1,15}[\s]*>)/gi, '');
    str = str.replace(/(<\/[a-z0-9\-]{1,15}[\s]*>)/gi, '');
    str = str.replace(/(<[a-z0-9\-]{1,15}[\s]*\/>)/gi, '');
    str = str.replace(/^\s+|\s+$/gm,''); // trim spaces

    for(let i=0; i<from.length; ++i)
      str = str.split(from[i]).join(to[i]);

    // Replace different kind of spaces with dashes
    var spaces = [/(&nbsp;|&#160;|&#32;)/gi, /(&mdash;|&ndash;|&#8209;)/gi,
      /[(_|=|\\|\,|\.|!)]+/gi, /\s/gi];

    for(let i=0; i<from.length; ++i)
      str = str.replace(spaces[i], '-');

    str = str.replace(/-{2,}/g, "-");

    // remove special chars like &amp;
    str = str.replace(/&[a-z]{2,7};/gi, '');
    str = str.replace(/&#[0-9]{1,6};/gi, '');
    str = str.replace(/&#x[0-9a-f]{1,6};/gi, '');
    str = str.replace(/[^a-z0-9\-]+/gmi, ""); // remove all other stuff
    str = str.replace(/^\-+|\-+$/gm,''); // trim edges

    return str;
  }

  new() {
    this.view = EditorView.New;
  }

  preview() {
    this.post.article = [];
    this.queue.forEach((part) => this.post.article.push(part.data));
    this.view = EditorView.Preview;
  }

  public publish() {
    const api = 'https://6o5oj7u1p5.execute-api.eu-central-1.amazonaws.com/prod/admin/publish';
    this.action = EditorAction.Waiting;

    this.apiService.publish(this.post, api)
      .subscribe(
        (response: ApiResponse) => {
          // this function is executed every time there's a new output
          console.log('VALUE RECEIVED: ' + JSON.stringify(response));

          this.action = !response.items[response.items.length - 1].statusCode ? EditorAction.Success : EditorAction.Error;

          if(response.items[response.items.length - 1].statusCode) {
            console.log('ERROR!');
            this.change.emit(this.post.slug);
          }
          else {
            console.log('SUCCESS!');
            this.change.emit(this.post.slug);
          }
        },
        (err) => {
          // this function is executed when there's an ERROR
          console.log('ERROR: ' + JSON.stringify(err));
        },
        () => {
          // this function is executed when the observable ends (completes) its stream
          console.log('COMPLETED');
        });
  }
}

export class EditorBlock {
  focus: boolean;
  data: Part = {
    type: '',
    url: '',
    alt: '',
    text: '',
    subtitle: '',
    css: ''
  };

  constructor(type: string, focus: boolean = false) {
    this.data.type = type;
    this.focus = focus;
  }

  public setFocus(value) {
    if (this.data.type === 'paragraph' && !this.data.text || this.data.text === '') {
      if (!value && this.focus) {
        // tslint:disable-next-line:max-line-length
        this.data.text = 'Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Aenean lacinia bibendum nulla sed consectetur. Nulla vitae elit libero, a pharetra augue.';
      }
    }

    this.focus = value;
  }
}
