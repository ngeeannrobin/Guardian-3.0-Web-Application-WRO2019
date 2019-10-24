import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class RealtimedatabaseService {
  ref: AngularFireObject<{}>;
  constructor(private db: AngularFireDatabase) { }

  GetRequest(path:string){
    this.ref = this.db.object(path);
    return new Promise(resolve => {
      this.ref.snapshotChanges().subscribe(
        action => {
          resolve(action.payload.val());
        },
        err => {
          console.log(err);
          reject(err);
        }
      )
    })
  }

  FetchUserType(userID: string): Promise<{}>{
    return this.GetRequest(`user/${userID}/userType`);
  }

  FetchQuestion(material: string): Promise<{}> {
    return this.GetRequest(`question/${material}`);
  }

  FetchAllUserData():Promise<{}> {
    return this.GetRequest(`user`);
  }

  FetchAllPartner():Promise<{}> {
    return this.GetRequest(`partner`);
  }

  FetchUserName(userId: string):Promise<{}> {
    return this.GetRequest(`user/${userId}/username`)
  }

  FetchUserPoint(userId:string):Promise<{}>{
    return this.GetRequest(`user/${userId}/point`)
  }

  AwardUserPoint(userId:string, point:number){
    let promise = new Promise<{}>((resPromise,rejPromise)=>{
      resPromise(
        this.FetchUserPoint(userId).then(
          res => {
            let newPoint = +res + point
            this.ref = this.db.object(`user/${userId}/point`);
            this.ref.set(newPoint);
            return true;
          },
          err => {
            rejPromise(err);
          }
        )
      )
    });
    return promise;
  }

  GetAIInput(): Promise<any>{
    return this.GetRequest(`ai`);
  }

  GetWebServerIP(): Promise<any>{
    return this.GetRequest(`ip`);
  }

  checkUsernameExist(username: string){
    return new Promise<any>((resPromise,rejPromise)=>{
      resPromise(
        this.FetchAllUserData().then(
          res => {
            let userData = res;
            for (let userId in userData){
              if (username && username.toUpperCase() == (userData[userId].username && userData[userId].username.toUpperCase())){
                resPromise(true)
              }
            }
            resPromise(false);
          },
          err => {console.log(err);rejPromise(err);}
        )
      )
    })
  }

  postMaterial(material:string){
    this.ref = this.db.object(`webappserver`)
    return this.ref.set({
      material: material,
      uuid: Math.random()
    })
  }

  setUsername(uid:string,username:string){
    this.ref = this.db.object(`user/${uid}`)
    return this.ref.set({
      point: 0,
      userType: 'player',
      username: username});
  }
  


}
