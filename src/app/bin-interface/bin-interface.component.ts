import { Component, OnInit } from '@angular/core';
import { RealtimedatabaseService } from '../realtimedatabase.service';
import { of, Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-bin-interface',
  templateUrl: './bin-interface.component.html',
  styleUrls: ['./bin-interface.component.css']
})
export class BinInterfaceComponent implements OnInit {

  material:string;
  message:string;
  mode:string;
  randomQuestion:string;
  questions:any;
  aidata:any;
  checking = false;


  constructor(
    private dbService: RealtimedatabaseService,
    private httpService: HttpService) { }

  ngOnInit() {
    this.reset();
  }

  end(){
    // this.httpService.ActivateTheThingy(this.material);
    this.dbService.postMaterial(this.material);
    this.reset();
  }
  
  reset(){
    this.material = null;
    this.message = "Input trash to begin!";
    this.mode = null;
    this.randomQuestion = null;
    this.questions = null;
    this.aidata = undefined;
    this.getAiData();
    this.checkAiData();
  }

  getAiData(){
    // check if checking to allow one request at a time
    if (!this.checking){
      this.checking = true;
      this.dbService.GetAIInput().then(
        res => {
          this.aidata = res;
          this.checking = false;
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  // async function that constantly pull ai data from firebase.
  // function detects change in the data (meaning ai detected a material)
  // when change is detected, function will set the material variable and start the interaction. 
  async checkAiData(){
    while (this.aidata == undefined){
      await this.sleep(100);
    }
    let oldTimestamp = this.aidata && this.aidata.timestamp;
    while (true){
      await this.sleep(10);
      this.getAiData();
      if ((this.aidata!=undefined) && (oldTimestamp != (this.aidata && this.aidata.timestamp))){
        this.material = this.aidata.material_detected;
        console.log(`Material: ${this.material}`);
        this.startInteraction();
        break;
      }
    }
  }

  async sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startInteraction() {
    this.message = "Select a mode!";
    this.getQuestionData();
  }

  getQuestionData(){
    this.dbService.FetchQuestion(this.material)
    .then(
      res => {
        this.questions = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  getRandomQuestion(){ // For displaying fun fact and link in the more-info component
    const difficultyArray:Array<string> = this.getKeyArray(this.questions);
    const randomDifficulty = difficultyArray[Math.floor(Math.random() * difficultyArray.length)];
    const randomQuestions = this.questions[randomDifficulty];

    const qnIdArray = this.getKeyArray(randomQuestions);
    const randomQnId = qnIdArray[Math.floor(Math.random() * qnIdArray.length)];
    const randomQuestion = randomQuestions[randomQnId];

    return randomQuestion;
  }

  getKeyArray(obj): Array<string>{ // returns an array of keys in an object.
    let keyArray:Array<string> = []
    for (let key in obj)
      keyArray.push(key);
    return keyArray;
  }

  learnMore(){
    if (this.questions != null){
      console.log(this.randomQuestion);
      this.message = `The item you threw is made up of ${this.material}!`;
      this.randomQuestion = this.getRandomQuestion();
      this.mode="learn";
      console.log(this.randomQuestion);
    }

  }

  takeQuiz(){
    if (this.questions != null){
      this.message=""
      this.mode="quiz";
      // console.log()
    }
  }

  completeQuiz(event){
    this.randomQuestion = event;
    this.mode = "learn";
  }
}
