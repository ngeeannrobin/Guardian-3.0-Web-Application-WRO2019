import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RealtimedatabaseService } from '../realtimedatabase.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() questions: any;
  @Input() material: any;
  @Output() closeQuizEmitter = new EventEmitter();
  difficultyArray: Array<string>;
  selectedDifficulty;
  randomQn: any;
  optnIdArray: Array<string>;
  selectedOptn: string;
  answered: boolean;
  correct: boolean;
  stage: string = "unguess";
  message: string;
  pointAwarded: number = 0;
  username: string;
  materialList: Array<string> = [
    "Metal",
    "Paper",
    "Glass",
    "Plastic"
  ]
  materialObj: any = {
    "metal": "Metal",
    "paper": "Paper",
    "glass": "Glass",
    "plastic": "Plastic",
    "Metal": "Metal",
    "Paper": "Paper",
    "Glass": "Glass",
    "Plastic": "Plastic"
  }

  diffDic: any = {
    "easy": "Easy",
    "normal": "Normal",
    "hard": "Hard"
  }
  

  constructor(
    public dialog: MatDialog,
    private dbService: RealtimedatabaseService,
    private authService: AuthService) { }

  ngOnInit() {
    this.reset();
    this.startGuess();
  }

  randomiseOptnOrder(){
    let tempOptnIdArray = [...this.optnIdArray];
    let tempOptnIdArray2= [];
    let randIndex;
    for(let i=0; i<this.optnIdArray.length; i++){
      randIndex = Math.floor(Math.random()*tempOptnIdArray.length);
      tempOptnIdArray2.push(tempOptnIdArray[randIndex]);
      tempOptnIdArray.splice(randIndex,1);
    }
    this.optnIdArray = [...tempOptnIdArray2];
  }

  reset() {
    this.difficultyArray = [];
    this.selectedDifficulty = null;
    this.randomQn = null;
    this.optnIdArray = [];
    this.selectedOptn = null;
    this.answered = false;
    this.message = null;
  }

  startGuess(){
    this.constructGuessQn();
    this.selectedDifficulty = "";
  }

  constructGuessQn(){
    this.randomQn = {
      text: "Before you do the quiz, do you know what this item is made of?",
      option: {
        optn1: this.material
      },
      correct: "optn1"
    }
    let tempMaterialList = [...this.materialList];
    tempMaterialList.splice(tempMaterialList.indexOf(this.materialObj[this.material]),1);
    let randIndex;
    for(let i=2; i<=4; i++){
      randIndex = Math.floor(Math.random()*tempMaterialList.length);
      this.randomQn.option[`optn${i}`] = tempMaterialList[randIndex];
      tempMaterialList.splice(randIndex, 1);
      
    }
    this.optnIdArray = this.getKeyArray(this.randomQn.option);
    this.randomiseOptnOrder();
  }



  getKeyArray(obj): Array<string>{ // returns an array of keys in an object.
    let keyArray:Array<string> = []
    for (let key in obj)
      keyArray.push(key);
    return keyArray;
  }

  startQuiz(){
    this.selectRandomQuestion();
    this.optnIdArray = this.getKeyArray(this.randomQn.option);
    if (this.randomQn.random==1)
      this.randomiseOptnOrder();
  }

  selectRandomQuestion(){
    const qnIdArray = this.getKeyArray(this.questions[this.selectedDifficulty]);
    const randomQnId = qnIdArray[Math.floor(Math.random() * qnIdArray.length)];

    this.randomQn = this.questions[this.selectedDifficulty][randomQnId]
  }

  selectDifficulty(diff){
    this.selectedDifficulty = diff;
    this.startQuiz();
  }

  select(optnId){
    if (!this.answered)
      this.selectedOptn = optnId
  }

  continue(){
    switch(this.stage){
      case "unguess":
        this.guess();
        break;
      case "guessed":
        this.initiateQuiz();
        break;
      case "unanswered":
        this.answer();
        break;
      case "answered":
        this.popClaimDialog();
        break;
      case "claimed":
        this.completeQuiz();
        break;
      default:
        break;
    }
  }

  initiateQuiz(){
    this.reset();
    this.stage = "unanswered";
    this.difficultyArray = this.getKeyArray(this.questions);
    if (this.difficultyArray.length == 1){
      this.selectedDifficulty = this.difficultyArray[0];
      
      this.startQuiz();
    }
  }

  guess(){
    this.stage = "guessed"
    this.answered = true;
    this.correct = this.selectedOptn == this.randomQn.correct;
    this.pointAwarded += this.correct?50:5;
    this.message = this.correct?`Correct! You are entitled to ${this.pointAwarded} points! `:`It's actually ${this.material.toLowerCase()}! You are awarded ${this.pointAwarded} points for using our system! `
    this.message += 'Tap on "continue" for the quiz!'
  }

  answer(){
    this.stage = "answered";
    this.answered = true;
    this.correct = this.selectedOptn == this.randomQn.correct;
    let pointAwarded = this.correct?(+this.selectedDifficulty.split("_")[0]):5;
    this.pointAwarded += pointAwarded;
    this.message = this.correct?`Correct! You are entitled to ${pointAwarded} points, which brings the total up to ${this.pointAwarded} points! Tap on "continue" to claim the points.`:`Better luck next time! You may learn more about this question later on. In the mean time, you are awarded ${pointAwarded} points, which brings the total up to ${this.pointAwarded} points! Tap on "continue" to claim the points.`
  }

  popClaimDialog(){
    const dialogRef = this.dialog.open(QuizDialog, {
      width: "50%",
      data: {point: this.pointAwarded}
    });

    dialogRef.componentInstance.username = "";

    dialogRef.afterClosed().subscribe(
      res => {
        this.stage = "claimed";
        this.username = dialogRef.componentInstance.username;
        this.message = `${this.pointAwarded} will be awared to ${this.username}. Tap continue for more information on this question.`
        this.dbService.FetchUserPoint(this.authService.getUserID()).then(
          res => this.message += ` Or tap here to claim your ${res} points!`,
          err => console.log(err)
        );
      }
    )
  }

  completeQuiz(){
    this.closeQuizEmitter.emit(this.randomQn);
  }

  showQR(){
    if (this.stage == "claimed"){
      const dialogRef = this.dialog.open(QuizQrDialog, {
        width: "50%",
        data: {}
      });
    }
  }
}

@Component({
  selector: 'dialog-quiz',
  templateUrl: 'quiz.component.inputBox.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizDialog {
  mode:string = "username";
  title:string = "Please enter your username!";
  switchText:string = "Register"
  username: string = "";
  email: string = "";
  password: string = "";
  message: string = "";
  size: number;
  link: string = "https://guardianthreepointo.web.app/register"

  constructor(
    public dialogRef: MatDialogRef<QuizDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dbService: RealtimedatabaseService,
    private authService: AuthService) {}

  ngOnInit(){
    this.size = document.getElementById("fullWidth").clientWidth / 2;
  }

  switch(){
    this.message = "";
    if (this.mode=="username"){
      this.mode = "register";
      this.title = "Scan this QR code with your phone and register!";
      this.switchText = "";
    }
    else{
      this.mode = "username";
      this.title = "Please enter your username!";
      this.switchText = "Register";
    }
  }

  checkUsernameExist(){
    this.dbService.checkUsernameExist(this.username).then(
      res => {
        if (res){
          this.AwardPoint(this.authService.getUserID());
        }
        else{
          this.message = "Username not found in system. Consider registering!"
        }
      },
      err => {console.log(err)}
    )
  }

  AwardPoint(userId: string){
    this.dbService.AwardUserPoint(userId,this.data.point)
    .then(
      res => {
        if (res){
          this.dialogRef.close();
        }
      }
    )
  }

  registerUser(){
    this.authService.registerPlayer(this.email,this.password,this.username);
  }

  OK(){
    if (this.mode=="username"){
      this.checkUsernameExist();
    }
    else {
      this.mode = "username";
      this.title = "Please enter your username!";
      this.switchText = "Register";
    }
  }

  npr(){
    this.username = "NgeeAnnRobin";
  }

  //   onNoClick(): void {
  //     this.dialogRef.close();
  // }
}

@Component({
  selector: 'dialog-quiz',
  templateUrl: 'quiz-qrcode.dialog.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizQrDialog {
  link: string = "https://guardianthreepointo.web.app/login"
  size: number;
  constructor(
    public dialogRef: MatDialogRef<QuizDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(){
    this.size = document.getElementById("qrcontainer").clientWidth;
  }
}