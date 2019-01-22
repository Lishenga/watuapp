import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ChatPage } from '../chat/chat';
import { HttpClient } from '@angular/common/http';
import { OneSignalProvider } from '../../providers/one-signal/one-signal';
import { OneSignal } from '@ionic-native/onesignal';

/**
 * Generated class for the ChatRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({

  selector: 'page-chat-room',

  templateUrl: 'chat-room.html',
  
})

export class ChatRoomPage {
  
  @ViewChild('input') myInput;

  create = {username:'',room:'', name:'', message:''}

  curtrentUser = '';

  factory = {};

  messages = [];

  date = []
  
  username: any

  room: any

  datas: any

  nickname = '';

  message = '';

  id : any

  userid: any

  name: string

  sender: any

  receiver: any

  value = []

  partner: any

  allchat: any

  constructor(public navCtrl: NavController,private oneSignal: OneSignal, private http: HttpClient, public navParams: NavParams, private socket: Socket, private toastCtrl: ToastController, private storage: Storage, private OneSignalProvider: OneSignalProvider,) {

  this.nickname = this.navParams.get('nickname');

  this.partner = this.navParams.get('partner');

  this.storage.get('_token').then((val) => {

    this.sender = val.data.msisdn
    
  });

  this.storage.get('receiver').then((val) =>{

    this.receiver = val

  })

  this.id = this.navParams.get('socketid');

  const load = {

    chat_id: this.id 

  }


  http.post('http://142.93.7.234:84/api/ChatGetMessages/', load)
  
    .subscribe(res => {

      console.log({'success':res});

      this.allchat = res

        for(let item of this.allchat.data){
          
          this.value.push(item)
        }
      
    }, (err) => {

    console.log({'error':err});

    })

    if (!this.nickname || !this.id) {

      this.navCtrl.setRoot('ChatPage');

    }else{

      this.joinChat();
    }
    
    this.getMessages().subscribe(message => {

      this.messages.push(message);

    });

    this.getUsers().subscribe(data => {

      let user = data['user']; 

      if (data['event'] === 'left') {

        this.presentToast('User left: ' + user);

      } else {

        this.presentToast('User joined: ' + user);

      }

    });

}

joinChat(){

  this.socket.connect()

  this.socket.emit('set-nickname', { username: this.nickname});

  this.socket.emit('add-message', { socketid: this.id});

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

sendMessage() {

  this.storage.get('socketid').then((val) => {
    
    this.id = val
    
  });

  this.storage.get('_token').then((val) => {
    
    this.name = val.data.fname + " " + val.data.lname

    this.sender = val.data.msisdn
    
  });

  const chat = {

    receiver: this.receiver,

    sender: this.sender,

    chat_id: this.id,

    message: this.message

  }

  const player = {

    msisdn: this.receiver

  }


  this.http.post('http://142.93.7.234:84/api/ChatSendMessage/', chat)
  
    .subscribe(res => {

      console.log({'success':res});
      
    }, (err) => {

    console.log({'error':err});

    })

  this.http.post('http://142.93.7.234:84/api/ChatGetPlayerDetails/', player)
  
    .subscribe(res => {

      console.log({'success':res});

      this.userid = res
      
      if(this.userid.status_code == 500){

        this.socket.emit('add-message', { text: this.message, socketid: this.id, name:this.name, sender: this.sender, receiver: this.receiver});

        this.message = '';

      }else if (this.userid.status_code == 200) {
        
        this.socket.emit('add-message', { text: this.message, socketid: this.id, name:this.name, oneSignal: this.userid.data.player_id, sender: this.sender, receiver: this.receiver });

        this.message = '';
      }
      
    }, (err) => {

    console.log({'error':err});

    })

}

getUsers() {

  let observable = new Observable(observer => {

      this.socket.on('users-changed', (data) => {

          observer.next(data);

      });

  });

  return observable;

}

presentToast(message) {

  let toast = this.toastCtrl.create({

    message: message,
 
    duration: 2000,

    position: 'bottom'

  });

  toast.onDidDismiss(() => {

    console.log('Dismissed toast');

  });

  toast.present();

}

  ionViewDidLoad() {

    console.log('ionViewDidLoad ChatRoomPage');

  }

}
