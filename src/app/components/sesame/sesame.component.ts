import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sesame',
  templateUrl: './sesame.component.html',
  styleUrls: ['./sesame.component.scss']
})
export class SesameComponent {

  openSesameStatus = ''
  loading = false;
  constructor(private http: HttpClient) {
  }

  openSesame() {
    this.loading = true;
    this.http.post('https://jonahtoch.com/api/v1/sesame', 'test').subscribe(
      {
        next: res => {
          console.log(res);
          this.openSesameStatus = 'success';
        },
        error: err => {
          console.log(err);
            this.openSesameStatus = 'failure';
        },
        complete: ()=> {
          this.loading = false;
    }
      }
    )
  }

}
