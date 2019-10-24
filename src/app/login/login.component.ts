import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RealtimedatabaseService } from '../realtimedatabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string="";
  password:string="";
  message:string="";
  navMap: any = {
    "bin":"/BinChatBot",
    "admin":"",
    "player":"/redeem"};

  constructor(private authService: AuthService, private router: Router, private dbService: RealtimedatabaseService) { }
  ngOnInit() {
  }

  cheat(){
    this.email = "bin@guardian3.0"
    this.password = "securepassword"
  }

  login(){
    this.message = "Attempting to log in..."
    this.authService.login(this.email.trim(),this.password)
    .then(res => {
      this.message = "Log in sucessful, fetching user data...";
      this.checkUserType();
      
    }, err => {
      this.message = err.message;
    })
  }

  checkUserType(){
    this.dbService.FetchUserType(this.authService.getUserID())
    .then(res => {
      this.message = "User data fetched, redirecting...";
      this.router.navigate([this.navMap[String(res)]]);

    }, err => {
      this.message = `Error fetching user data. ${err}`;
    }
    )
  }

}
