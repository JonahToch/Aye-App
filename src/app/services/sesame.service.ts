import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable} from "rxjs";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {Sesame} from "../interfaces/sesame";
import {Poop} from "../models/poop";

@Injectable({
  providedIn: 'root'
})
export class SesameService {

  private sesameData_: BehaviorSubject<Sesame[]> = new BehaviorSubject<Sesame[]>([]);
  sesameData$ = this.sesameData_.asObservable();


  constructor(
    private http: HttpClient,
  ) {
  }

  getSesame(userId: string) {
    const url: string = `${environment.mainApiUrl}/sesame?userId=` + userId;
    return this.http.get<Sesame[]>(url)
      .pipe(map(res => {
          this.sesameData_.next(res);
          console.log(res);
          return res;
        }),
      );
  }

}
