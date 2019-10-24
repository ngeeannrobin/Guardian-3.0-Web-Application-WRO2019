import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinInterfaceComponent } from './bin-interface/bin-interface.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RedeempointComponent } from './redeempoint/redeempoint.component';
import { BinChatBotComponent } from './bin-chat-bot/bin-chat-bot.component';


const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "redeem", component: RedeempointComponent},
  {path: "BinInterface", pathMatch: "full", component: BinInterfaceComponent},
  {path: "BinChatBot", pathMatch: "full", component: BinChatBotComponent},
  {path: "**", redirectTo: ""},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
