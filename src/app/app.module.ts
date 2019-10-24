import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BinInterfaceComponent } from './bin-interface/bin-interface.component';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { environment, firebaseConfig } from 'src/environments/environment';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MoreInfoComponent, MoreInfoQRCodeDialog } from './more-info/more-info.component';
import { QuizComponent, QuizDialog, QuizQrDialog } from './quiz/quiz.component';
import { QRCodeModule } from 'angular2-qrcode';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { RedeempointComponent, RedeempointDialog } from './redeempoint/redeempoint.component';
import { BinChatBotComponent, MoreInfoQRCode } from './bin-chat-bot/bin-chat-bot.component';
// import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    AppComponent,
    BinInterfaceComponent,
    LoginComponent,
    MoreInfoComponent,
    QuizComponent,
    QuizDialog,
    MoreInfoQRCodeDialog,
    RegisterComponent,
    RedeempointComponent,
    RedeempointDialog,
    QuizQrDialog,
    BinChatBotComponent,
    MoreInfoQRCode
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule, 
    
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    FormsModule,
    QRCodeModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    QuizDialog,
    MoreInfoQRCodeDialog,
    RedeempointDialog,
    QuizQrDialog]
})
export class AppModule { }
