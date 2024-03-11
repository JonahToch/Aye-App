import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Poop} from "../models/poop";
import {catchError, Observable, of, tap, map, BehaviorSubject, count, Subject} from "rxjs";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class PoopService {

  private poopList_: BehaviorSubject<any> = new BehaviorSubject(null);
  poopListObs$: Observable<any> = this.poopList_.asObservable();

  private poopLoaded_: BehaviorSubject<boolean> = new BehaviorSubject(false);
  poopLoaded$: Observable<boolean> = this.poopLoaded_.asObservable();

  constructor(
    private http: HttpClient,
  ) {
  }

  getPoops(): Observable<Poop[]> {
    const url = `${environment.mainApiUrl}/poop/list-all`;
    const httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://jonahtoch.com',
        },
      )
    };
    return this.http.get<Poop[]>(url, httpOptions)
      .pipe(map(res => {
          // console.log('gathering poop list...');
          res.reverse();
          this.poopList_.next(res);
          this.poopLoaded_.next(true);
          return res;
        }),
        catchError(this.handleError<Poop[]>('getPoops', []))
      );
  }

  addPoops(userId: string, description: string, rating: number, date: Date, fullAddr?: string,
           lng?: string, lat?: string, street?: string, city?: string, longState?: string,
           country?: string, zipcode?: string): void {
    const url = `${environment.mainApiUrl}/poop/create`;
    const body = {
      userId: userId,
      description: description, rating: rating, date: date, fullAddr: fullAddr, longitude: lng,
      latitude: lat, street: street, city: city, longState: longState, country: country, zipcode: zipcode
    };
    console.log('sending request with this data ' + body);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    };
    this.http.post<any>(url, body, httpOptions).subscribe(
      // value => console.log('returned this data ' + value)
    );
  }

  addRating(_id: string, likes: number, dislikes: number): void {
    const url = `${environment.mainApiUrl}/poop/add-rating`;
    const body = {_id: _id, likes: likes, dislikes: dislikes};
    console.log('sending request with this data ' + body);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    };
    this.http.post<any>(url, body, httpOptions).subscribe(
      value => console.log('returned this data ' + value)
    );
  }

  addCommentRating(_id: string, likes: number, dislikes: number): void {
    const url = `${environment.mainApiUrl}/poop/add-comment-rating`;
    const body = {_id: _id, likes: likes, dislikes: dislikes};
    console.log('sending request with this data ' + body);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    };
    this.http.post<any>(url, body, httpOptions).subscribe(
      value => console.log('returned this data ' + value)
    );
  }

  addComment(_id: string, user: string, text: string, date: Date): void {
    const url = `${environment.mainApiUrl}/poop/add-comment`;
    const body = {_id: _id, user: user, text: text, date: date};
    console.log('sending request with this data ' + body.text + "/" + body._id + "/" + body.user + "/" + body.date);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    };
    this.http.post<any>(url, body, httpOptions).subscribe(
      value => console.log('returned this data ' + value)
    );
  }

  addCommentReply(poop_id: string, comment_id: string, user: string, text: string, date: Date): void {
    const url = `${environment.mainApiUrl}/poop/add-comment-reply`;
    const body = {poop_id, comment_id, user, text, date};
    console.log('sending request with this data ' + body);
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
    };
    this.http.post<any>(url, body, httpOptions).subscribe(
      value => console.log('returned this data ' + value)
    );
  }

  checkOnline() {
    const url = `${environment.mainApiUrl}/poop/list-all`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://jonahtoch.com'
      })
    };
    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError<boolean>('isOnline', false)))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
