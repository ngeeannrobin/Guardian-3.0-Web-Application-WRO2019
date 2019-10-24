import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RealtimedatabaseService } from '../realtimedatabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email:string="";
  password:string="";
  username:string="";
  message:string="";
  constructor(
    private authService: AuthService,
    private dbService: RealtimedatabaseService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  register() {
    this.dbService.checkUsernameExist(this.username).then(
      res => {
        if (!res){
          this.authService.registerPlayer(this.email,this.password,this.username).then(
            res => {
              this.dbService.setUsername(this.authService.getUserID(),this.username);
              this.message = "Registration sucessful!";
              this.router.navigate(["/redeem"]);

            },
            err => {this.message = this.message = err.message;}
          )
        }
        else {
          this.message = "Username is taken."
        }
      },
      err => {console.log(err)}
    )
    
  }

}
