import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UntypedFormBuilder} from "@angular/forms";

@Component({
  selector: 'app-sesame',
  templateUrl: './sesame.component.html',
  styleUrls: ['./sesame.component.scss']
})
export class SesameComponent {

  openSesameStatus = '';
  assigningSesameStatus = ''
  loading = false;
  assigningSesame = false;

  formData = this.formBuilder.group({
    sesameId: '',
  })

  constructor(private http: HttpClient,
              private formBuilder: UntypedFormBuilder,
  ) {
  }


  assignNewSesame() {
    this.assigningSesame = true;
    this.openSesameStatus = '';

  }

  claimSesame() {
    this.loading = true;
    this.openSesameStatus = '';

    const body = {
      "sesameId": "7cc04d9b-1b81-4398-bb9e-ad229c672635",
      "userId": "testJONAH",
    }
    this.http.post('https://jonahtoch.com/api/v1/sesame', body).subscribe(
      {
        next: res => {
          console.log(res);
          this.assigningSesameStatus = 'success';
          this.assigningSesame = false;
        },
        error: err => {
          this.loading = false;
          this.assigningSesameStatus = 'failure';
        },
        complete: () => {
          this.loading = false;
        }
      }
    )
  }


  openSesame() {
    this.loading = true;
    this.assigningSesameStatus = '';
    this.http.post('https://jonahtoch.com/api/v1/sesame', 'test').subscribe(
      {
        next: res => {
          console.log(res);
          this.openSesameStatus = 'success';
        },
        error: err => {
          this.loading = false;
          this.openSesameStatus = 'failure';
        },
        complete: () => {
          this.loading = false;
        }
      }
    )
  }

}
