import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReversePage } from './reverse';

@NgModule({
  declarations: [
    ReversePage,
  ],
  imports: [
    IonicPageModule.forChild(ReversePage),
  ],
})
export class ReversePageModule {}
