import { Component, OnInit, Inject, Input } from '@angular/core';
import { RealtimedatabaseService } from '../realtimedatabase.service';
import { HttpService } from '../http.service';
import undefined = require('firebase/empty-import');

@Component({
  selector: 'app-bin-chat-bot',
  templateUrl: './bin-chat-bot.component.html',
  styleUrls: ['./bin-chat-bot.component.css']
})
export class BinChatBotComponent implements OnInit {
  math = Math;
  messages: Array<any>;
  checking: boolean;
  aidata: any;
  material: string;
  questions: any;
  qrSize: number;
  materialList: any = ["Plastic","Metal","Paper","Glass"]

  constructor(
    private dbService: RealtimedatabaseService,
    private httpService: HttpService) { }

  ngOnInit() {
    this.reset();
  }

  test(){
    this.insertTextMessage("test", false);
  }

  reset(){
    this.messages = [];
    this.insertTextMessage("Hello world, I am a Gamified User-friendly Automated Rubbish Disposing Instrument (Amazing Name), or G.U.A.R.D.I.A.N for short. Please input trash to begin!", true)

    this.checkAiData();
  }

  async learnMore(question){
    let dykMessage = `Did you know? ${question.fact}`;
    this.insertTextMessage(dykMessage, true);
    await this.textSleep(dykMessage);
    this.insertQRCodeMessage(`Find out more at ${question.link}, or scan this QR code:`, question.link);
    this.insertButtonMessage("reset","Reset");
  }

  

  quiz(){
    this.insertOptionMessage("Before you do the quiz, do you know what this item is made of?", this.getRandomMaterialList(this.material), "guess_material")
  }

  getRandomQuestion(){
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

  async confirmSelection(btnMsg:any){
    // let msg = this.messages[this.messages.length-2];
    // let cfrmMsg = this.messages[this.messages.length-1];
    // msg.data.disabled = true;


    switch(btnMsg.data.id){
      case "mode":
        let msg = this.messages[this.messages.length-2];
        let cfrmMsg = this.messages[this.messages.length-1];
        msg.data.disabled = true;
        for (let i = 0; i < msg.data.option.length; i++) {
          const optn = msg.data.option[i];
          if (optn.optnId == msg.data.selected){
            //this.insertTextMessage(optn.text, false);
            cfrmMsg.data.text = optn.text;
            cfrmMsg.data.confirmed = true;
            break;
          }
        }
        if (msg.data.selected == "learn_more"){
          let materialText = `The item you threw is made up of ${this.material}.`;
          this.insertTextMessage(materialText,true);
          await this.textSleep(materialText);
          this.learnMore(this.getRandomQuestion());
        }
        else if (msg.data.selected == "take_quiz"){
          this.quiz();
        }
        break;
      case "reset":
        this.reset();
        break;
      default:
        break
    }
  }

  selectOption(msg:any,optionid:string){
    console.log(msg)
    if (!msg.data.selected){
      this.insertButtonMessage(msg.data.id, "Confirm");
    }
    if (!msg.data.disabled){
      msg.data.selected = optionid;
      // this.messages[this.messages.length-2].data.selected = optionid;
    }
  }

  insertMessage(messageObject:any){
    messageObject.same = {prev: false, next: false};
    let msgCount = this.messages.length;
    if (msgCount != 0){
      let sameAsPrev = this.messages[msgCount-1].bot == messageObject.bot;
      if (sameAsPrev){
        messageObject.same.prev = true;
        this.messages[msgCount-1].same.next = true;
      }
    }
    this.messages.push(messageObject);
  }

  insertTextMessage(text:string, fromBot:boolean){
    let messageObject = {
      type: "text",
      bot: fromBot,
      data: {
        text: text
      }
    };
    this.insertMessage(messageObject);
  }

  insertOptionMessage(text:string, option:any, id:string){
    let messageObject = {
      type: "option",
      bot: true,
      data: {
        text: text,
        option: option,
        id: id,
        selected: undefined,
        disabled: false
      }
    };
    this.insertMessage(messageObject);
    
  }

  insertQRCodeMessage(text:string, link:string, option:boolean=false){
    let messageObject = {
      type: "QR_code",
      bot: true,
      data: {
        option: option,
        text: text,
        link: link
      }
    };
    this.insertMessage(messageObject);
  }

  insertButtonMessage(id:string, text:string){
    let messageObject = {
     type: "Btn",
     bot: false,
     data: {
      confirmed: false,
      text: null,
      id: id,
      btnText: text
     } 
    }
    this.insertMessage(messageObject);
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
      this.getAiData();
      await this.sleep(100);
    }
    let oldTimestamp = this.aidata && this.aidata.timestamp;
    while (true){
      await this.sleep(10);
      this.getAiData();
      if ((this.aidata!=undefined) && (oldTimestamp != (this.aidata && this.aidata.timestamp))){
        this.material = this.aidata.material_detected;
        await this.getQuestionData();
        this.insertOptionMessage("I have detected an object. Please select one of the two modes to proceed.",
          [{optnId: "learn_more", text: "Learn More"},{optnId: "take_quiz", text: "Take Quiz"}], "mode");
        break;
      }
    }
  }

  getQuestionData(){
    this.dbService.FetchQuestion(this.material)
    .then(
      res => {
        this.questions = res;
        console.log(this.questions);
      },
      err => {
        console.log(err);
      }
    )
  }

  async sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async textSleep(text:string){
    const charPerSec = 30;
    await this.sleep(text.length / charPerSec * 1000);
  }

  getRandomMaterialList(material){
    // this.randomQn = {
    //   text: "Before you do the quiz, do you know what this item is made of?",
    //   option: {
    //     optn1: this.material
    //   },
    //   correct: "optn1"
    // }
    // let tempMaterialList = [...this.materialList];
    // tempMaterialList.splice(tempMaterialList.indexOf(this.materialObj[this.material]),1);
    // let randIndex;
    // for(let i=2; i<=4; i++){

      
    // }
    // this.optnIdArray = this.getKeyArray(this.randomQn.option);
    // this.randomiseOptnOrder();

    let optionArray = [];
    optionArray.push({optnId: "optn1", text: material})

    let tempMaterialList = [...this.materialList];
    tempMaterialList.splice(tempMaterialList.indexOf(this.material),1)
    let randIndex;
    for (let i=0; i<tempMaterialList.length; i++){
      randIndex = Math.floor(Math.random()*tempMaterialList.length);
      optionArray[`optn${i}`] = tempMaterialList[randIndex];
      tempMaterialList.splice(randIndex, 1);
    }

    return optionArray;
  }

  

}


@Component({
  selector: 'bin-chat-qrcode',
  templateUrl: 'bin-chat-bot-qr-code.html',
  styleUrls: ['./bin-chat-bot.component.css']
})
export class MoreInfoQRCode {
  @Input() qrlink: string;
  size: number;

  constructor() {}

  ngOnInit(){
    this.size = document.getElementById("qrcontainer").clientWidth;

  } 

}