import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RealtimedatabaseService } from './realtimedatabase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private dbService: RealtimedatabaseService
  ) { }

  ActivateTheThingy(material: string){
    let header = new HttpHeaders({

    });
    let httpOptions = {
      headers:header,
    };

    let body = {body: {material: material}}

    this.dbService.GetWebServerIP().then(
      res => {
        console.log(res);
        let url = `https://${res}:5000/cycleMaterial?material=${material}`
        this.http.post(url, null,httpOptions).subscribe(
          res => {
            console.log(res);
          }
        );
      },
      err => console.log(err)
    )

  }

}
