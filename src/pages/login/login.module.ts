import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { LandingPageModule } from '../landing/landing.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    LandingPageModule,
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
