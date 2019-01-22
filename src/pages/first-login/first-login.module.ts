import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstLoginPage } from './first-login';

@NgModule({
  declarations: [
    FirstLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstLoginPage),
  ],
})
export class FirstLoginPageModule {}
