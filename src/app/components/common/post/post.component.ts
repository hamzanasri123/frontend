import { Component, ElementRef, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post, Comment } from 'src/app/interfaces/posts.interface';
import { environment } from 'src/environments/environment';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/users.interface';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

declare var app, loadSvg, initTooltips,
  initCharts,
  initHexagons,
  initPopups,
  initHeader,
  initContent,
  initLoader, loadSvg: any;
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer,
    private postService: PostService,
    private authService: AuthService,
    private el: ElementRef,
    private translate: TranslateService,
  ) { }
  @Input()
  post: Post;

  @Output()
  postDeleted = new EventEmitter();

  readonly API: string = environment.apiUrl + '/';
  groupedReactions: any[];
  reacted: boolean = false;
  currentUser: User
  profilePicture: HTMLInputElement;
  commentsVisible = false;
  newComment: string;
  comments: Comment[] = [];
  language: string;
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (this.post.attachmentType == 'youtube') {
      this.post.attachment = this.sanitizer
        .bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.post.attachment}`) as string;
    }
    this.reacted = this.post.reacts.some(
      reaction => {
        return reaction.author._id == this.currentUser._id
      });
    
    loadSvg();
    initTooltips();
    initCharts();
    initPopups();
    initHeader();
    initContent();
    initLoader();
    this.language = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
    });
  }

  reactToPost(reaction: string) {
    this.postService.reactToPost(this.post._id, reaction).subscribe(
      res => {
        this.post.reacts = res.data.reacts;
        this.reacted = !this.reacted;
        initTooltips();
        initPopups();
      },
      err => {
        console.log(err);
      }
    )
  }

  toggleComments() {
    this.commentsVisible = !this.commentsVisible;
    this.comments = [];
    if (!this.commentsVisible) {
      return;
    }
    this.postService.getComments(this.post._id, 3).subscribe(
      res => {
        this.comments = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  deletePost() {
    Swal.fire({
      title: this.translate.instant('delete_post') + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('delete_post'),
      cancelButtonText: this.translate.instant('discard')
    }).then((result) => {
      if (result.value) {
        this.postService.deletePost(this.post._id).subscribe(
          res => {
            Swal.fire(
              {
                title: this.translate.instant('deleted_post'),
                icon: 'success'
              });
            this.postDeleted.emit(this.post._id);
          },
          err => {
            Swal.fire({
              title: this.translate.instant('delete_post_error'),
              icon: 'error'
            });
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    })
  }

  updatePost() {
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        console.log("updated ");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    })
  }

  reportPost() {

  }

}
