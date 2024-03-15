import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Poop} from "../models/poop";
import {concatMap, isEmpty, Observable, of, Subscription, tap} from "rxjs";
import {PoopService} from "../services/poop.service";
import {UntypedFormBuilder} from "@angular/forms";
import {ScrollingModule} from '@angular/cdk/scrolling';
import {AuthService} from "@auth0/auth0-angular";
import {SharedDataService} from "../services/shared-data.service";
import {AyeUser} from "../interfaces/aye-user";
import {environment} from "../../environments/environment.prod";


@Component({
  selector: 'app-poop-diaries',
  templateUrl: './poop-diaries.component.html',
  styleUrls: ['./poop-diaries.component.scss']
})
export class PoopDiariesComponent implements OnInit {

  isLoadedContentSubscription: Subscription;
  isContentLoaded = false;
  poops$!: Observable<Poop[]>;
  addCommentDate: Date;
  addCommentUserId = '';
  addCommentText = '';
  addReplyCommentDate: Date;
  addReplyCommentText = '';
  entriesToShow = 5;
  ayeUser: AyeUser | undefined;
  isLoggedIn = false;
  token: any;

  formData = this.formBuilder.group({
    name: '',
    comment: '',
  });

  replyFormData = this.formBuilder.group({
    replyName: '',
    replyComment: '',
  });


  constructor(
    private http: HttpClient,
    private poopService: PoopService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private sharedDataService: SharedDataService,
  ) {
    this.addCommentDate = new Date();
    this.addReplyCommentDate = new Date();
    this.getManagementAuthToken();
      this.isLoadedContentSubscription = this.poopService.poopLoaded$.subscribe((v) => {
      console.log(v);
      this.isContentLoaded = v;
    });
    this.auth.isAuthenticated$.subscribe(
      (res) => {
        this.isLoggedIn = res;
        if (res) {
          this.sharedDataService.ayeUser$.subscribe(
            (res) => {
              if (res) {
                this.ayeUser = res;
                console.log(res);
              } else {
                this.auth.user$
                  .pipe(
                    concatMap((user: any) =>
                      this.http.get(
                        // @ts-ignore
                        encodeURI(`https://dev-mn6falogt3c14mat.us.auth0.com/api/v2/users/${user.sub}`)
                      )
                    ),
                    tap((ayeUser: any) => {
                        this.ayeUser = res;
                        this.setAyeUser(ayeUser);
                      }
                    )
                  ).subscribe();
              }
            },
            (error) => {
              console.log(error);
            },
          )
        }
      }
    )
    // this.ayeUser = this.sharedDataService.ayeUser_.getValue();
  }

  ngOnInit(): void {
    this.isContentLoaded = false;
    this.poops$ = this.poopService.getPoops();
  }


  getManagementAuthToken() {
    return this.sharedDataService.getManagementAuthToken().subscribe(
      (res): void => {
        this.token = res;
      }
    )
  }

  getUser(userId: string, managementAuthToken: string): Observable<AyeUser> {
    return this.sharedDataService.getUserById(userId, managementAuthToken);
  }


  showMoreEntries()
  {
    this.entriesToShow += 15;
  }

  setAyeUser(ayeUser: AyeUser) {
    this.sharedDataService.setUser(ayeUser)
  }

  addCommentRating(id: string, likes: number, dislikes: number) {
    this.poopService.addCommentRating(id, likes, dislikes);
  }

  addCommentReply(poop_id: string, comment_id: string, userId: string) {
    const currDate = new Date();
    const comment = this.replyFormData.get('replyComment')?.value;

    this.addReplyCommentDate = currDate;
    this.addReplyCommentText = comment;
    this.poopService.submitCommentReply(poop_id, comment_id, userId, comment, currDate);
    this.replyFormData.get('replyComment')?.setValue(null);
  }

  submitComment(id: string, userId: string) {
    const currDate = new Date();
    const comment = this.formData.get('comment')?.value;

    this.addCommentDate = currDate;
    this.addCommentUserId = userId;
    this.addCommentText = comment;
    console.log(id, userId, comment, currDate);
    this.poopService.submitComment(id, userId, comment, currDate);
    this.formData.get('comment')?.setValue(null);
  }

  addLike(id: string) {
    console.log(id);
    this.poopService.addRating(id, 1, 0)
  }

  addDislike(id: string) {
    console.log(id);
    this.poopService.addRating(id, 0, 1)
  }

  convertToDaysAgo(d: any) {
    const todayDate = new Date();

    if (d !== undefined) {
      let theDate1 = new Date(todayDate.toISOString())
      let theDate2 = new Date(d);
      let seconds = Math.floor((theDate1.getTime() - theDate2.getTime()) / 1000);

      let interval = seconds / 31536000;

      if (interval > 1) {
        if (Math.floor(interval) <= 1) return Math.floor(interval) + " year";
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        if (Math.floor(interval) <= 1) return Math.floor(interval) + " month";
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        if (Math.floor(interval) <= 1) return Math.floor(interval) + " day";
        return Math.floor(interval) + " days"
      }
      interval = seconds / 3600;
      if (interval > 1) {
        if (Math.floor(interval) <= 1) return Math.floor(interval) + " hour";
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        if (Math.floor(interval) <= 1) return Math.floor(interval) + " minute";
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }
    return d;
  }


}
