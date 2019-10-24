import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { firebaseConfig } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}

  login(email:string, password:string){
    
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        res => {
          resolve(res);
          
        }, 
        err => {
          reject(err);
        }
      )
    })
  }

  getUserID(): string{
    return firebase.auth().currentUser.uid;
  }

  userIsLoggedIn(): boolean{
    return (firebase.auth().currentUser != null)
  }

  registerPlayer(email:string, password:string, username: string): Promise<any>{
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  registerPlayerThruCloudFunction(email:string, password:string, username: string){
    let url = `https://us-central1-guardianthreepointo.cloudfunctions.net/createPlayer?email=${email}&password=${password}&username=${username}`;
    

    let header = new HttpHeaders({
      "Content-Type":"application/json",
      // "Authorization":data,
    });
    let httpOptions = {
      headers:header,
    };

    this.http.post(url,null,httpOptions).subscribe(
      res => {
        console.log(res);
      }
    );

   
  }

  logout(){
    firebase.auth().signOut();
  }

  // test(){
  //   this.afAuth.idToken.subscribe(
  //     user => {
  //       console.log(user.uid);
  //     }
  //   )
  // }
  
}
