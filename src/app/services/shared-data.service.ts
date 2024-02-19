import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable} from "rxjs";
import {Poop} from "../models/poop";
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppMetadata, AyeUser, Identity, UserMetadata} from "../interfaces/aye-user";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private managementAuthToken_: BehaviorSubject<any> = new BehaviorSubject(null);
  managementAuthToken$: Observable<any> = this.managementAuthToken_.asObservable();

  private ayeUser_: BehaviorSubject<AyeUser | undefined> = new BehaviorSubject<AyeUser | undefined>(undefined);
  ayeUser$: Observable<AyeUser | undefined> = this.ayeUser_.asObservable();

  constructor(
    private http: HttpClient,
  ) {
  }

  get isDevMode(): string | null {
    return localStorage.getItem('ayeApp-isDevMode');
  }

  set isDevMode(value: string | null) {
    if (value !== null) {
      localStorage.setItem('ayeApp-isDevMode', 'true');
    } else {
      localStorage.removeItem('ayeApp-isDevMode');
    }

  }

  getManagementAuthToken(): Observable<any> {
    if (this.managementAuthToken_.getValue()) {
      return this.managementAuthToken$;
    }
    const url: string = `${environment.mainApiUrl}/auth`;
    return this.http.get(url).pipe((res) => {
      res.subscribe((res: any) => {
      /*  console.log(res)/!**!/*/
        this.managementAuthToken_.next(res);
      })
      return res;
    })
  }

  getUser(username: string, managementAuthToken: string): Observable<any> {
  //   console.log('running getUser');
  //   if (this.ayeUser_) {
  //     console.log('we have ayeUser');
  //     return this.ayeUser$;
  //   }
    const url: string = `${environment.mainApiUrl}/users?type=isUsernameUnique&username=` + username + `&token=` + managementAuthToken;
    return this.http.get(url).pipe((res) => {
      res.subscribe((res: any) => {
        this.ayeUser_.next(res[0]);
      })
      return res;
    })
  }

  setUser(ayeUser: AyeUser) {
    this.ayeUser_.next(ayeUser);
  }

  isLoggedInUserData() {
    return !!this.ayeUser_;
  }

}
