import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

/*
  Generated class for the OneSignalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OneSignalProvider {

  constructor(public http: HttpClient, private platform: Platform, private oneSignal: OneSignal,private storage: Storage, ) {
    
  }

  init(){

    this.oneSignal.startInit("41cb1d6c-4d5a-4074-804e-11c1c3a42a36", "368613049521");
    
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    
    this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
      // do something when a notification is opened
      this.storage.set('messages',jsonData.notification.payload.body)
      
    });
    
    this.oneSignal.endInit();

  }

  id(){

    this.oneSignal.getPermissionSubscriptionState().then((status) => {

      this.storage.set('oneSignal',status.subscriptionStatus.userId)
       // String: OneSignal Player ID

    });

  }

}
