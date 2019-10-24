import { Component, OnInit, Inject } from '@angular/core';
import { RealtimedatabaseService } from '../realtimedatabase.service';
import { AuthService } from '../auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redeempoint',
  templateUrl: './redeempoint.component.html',
  styleUrls: ['./redeempoint.component.css']
})
export class RedeempointComponent implements OnInit {
  partnerData: any;
  username: string;
  userpoint: number;
  partnerArray: Array<string> = [];
  constructor(
    private dbService: RealtimedatabaseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    if (!this.authService.userIsLoggedIn())
      this.router.navigate(["/login"]);
    else{
      this.GetUserPoint();
      this.GetUserName();
      this.userpoint = 3750;
      this.GetPartner();
    }
  }

  redeem(partnerName){
    if (this.partnerData[partnerName].point <= this.userpoint){
      this.dbService.AwardUserPoint(
        this.authService.getUserID(),
        this.partnerData[partnerName].point * -1).then(
          res => this.showDialog("Points redeemed, check your email."),
          err => console.log(err)
        )
    }
    else{
      this.showDialog("You do not have enough points.");
    }
  }

  GetUserName(){
    this.dbService.FetchUserName(this.authService.getUserID()).then(
      res => {
        this.username = res.toString();
      },
      err => {console.log(err);}
    )
  }

  GetUserPoint(){
    this.dbService.FetchUserPoint(this.authService.getUserID()).then(
      res => {
        this.userpoint = +(res.toString());

      },
      err => {console.log(err);}
    )
  }

  GetPartner(){
    this.dbService.FetchAllPartner().then(
      res => {
        this.partnerData = res;
        for (let partnerKey in this.partnerData)
          this.partnerArray.push(partnerKey);
      },
      err => {console.log(err);}
    );
  }

  showDialog(message: string){
    const dialogRef = this.dialog.open(RedeempointDialog, {
      width: "50%",
      data: {message: message}
    });
  }

}

@Component({
  selector: 'dialog-redeem',
  templateUrl: 'redeempoint-message.dialog.html',
  styleUrls: ['./redeempoint.component.css']
})
export class RedeempointDialog {

  constructor(
    public dialogRef: MatDialogRef<RedeempointDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {}

  ngOnInit(){
  }
}