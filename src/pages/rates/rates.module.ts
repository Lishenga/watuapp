import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatesPage } from './rates';

@NgModule({
  declarations: [
    RatesPage,
  ],
  imports: [
    IonicPageModule.forChild(RatesPage),
  ],
})
export class RatesPageModule {}
