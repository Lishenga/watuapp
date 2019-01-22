import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { ChatRoomPage } from '../chat-room/chat-room';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-chat',

  templateUrl: 'chat.html',

})

export class ChatPage {

  @ViewChild('input') myInput;

  users = {user:''}

  nickname = '';

  name : string

  people : Array<{fname: string, lname: string}>

  messages = []

  phone: any

  id: any

  res: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private http: HttpClient, private storage: Storage, public loadingCtrl: LoadingController, ) {

    this.phone = this.navParams.get('phone')

    this.name = this.navParams.get('name')

    this.storage.get('finalusers').then((val) => {
      
      this.people = val
  
    });

    this.getMessages().subscribe(message => {
      
      this.messages.push(message);
  
    });
    
  }

  joinChat(data) {

    this.presentLoadingText(data)

  }


  ionViewDidLoad() {

    console.log('ionViewDidLoad ChatPage');

  }

  getMessages() {
    
    let observable = new Observable(observer => {
      
      this.socket.on('message', (data) => {

        if(data.text === undefined || data.text === null){

        if(data.chatid !== null || data.chatid !== undefined) {
          
          this.storage.set('socketid', data.chatid)

        }

        }else if(data.text !== undefined || data.text !== null){

          if(data.chatid !== null || data.chatid !== undefined){

            this.storage.get('socketid').then((val) =>{
  
              if (data.chatid === val){
                
                observer.next(data);
                
              }
            })
          }
        } 

      });

  });

  return observable;
  
  }


  presentLoadingText(data) {
    
    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      const chat={

        member_1:this.phone,

        member_2:data.phone

      }

      this.storage.set('receiver', data.phone)

      this.http.post('http://142.93.7.234:84/api/ChatloadAllchat/', chat)
      
        .subscribe((res) => {

          this.res = res
    
          console.log({'success':res});

          if(this.res.status_code == 200){

          this.navCtrl.push(ChatRoomPage, { nickname: this.name,socketid: this.res.data.chat_id, partner: data.name });

          }
        }, (err) => {
    
        console.log({'error':err});
    
        })
              

    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}
