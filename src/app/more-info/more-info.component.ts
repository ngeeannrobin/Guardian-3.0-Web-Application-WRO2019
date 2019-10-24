import { Component, OnInit, Input, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.css']
})
export class MoreInfoComponent implements OnInit {
  @Input() question:any;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  showQR(){
    const dialogRef = this.dialog.open(MoreInfoQRCodeDialog, {
      width: "50%",
      data: {link: this.question.link}
    });
  }
}

@Component({
  selector: 'dialog-qrcode',
  templateUrl: 'more-info-qr-code.dialog.html',
  styleUrls: ['./more-info.component.css']
})
export class MoreInfoQRCodeDialog {
  constructor(
    public dialogRef: MatDialogRef<MoreInfoQRCodeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,){}
    size: number;

    ngOnInit(){
      this.size = document.getElementById("qrcontainer").clientWidth;

    } 

}