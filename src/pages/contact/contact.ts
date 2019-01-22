import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { MenuController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { LandingPage } from '../landing/landing';
import { HomePage } from '../home/home';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-contact',

  templateUrl: 'contact.html',

})
export class ContactPage {

  create = {username:'',room:'', name:'', message:''}

  name : any

  email : any

  phone : any

  messages = [];

  message = '';

  contact_us : any

  time = [];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private app: App, public navParams: NavParams, private storage: Storage, private socket: Socket,private http: HttpClient, ) {

    this.storage.get('_token').then((val) => {

      if(val == null || val == undefined){

        return this.app.getRootNav().setRoot(HomePage);

      }

    });

    this.phone = this.navParams.get('phone')

    this.email = this.navParams.get('email')

    this.name =  this.navParams.get('names')
 

    this.getMessages().subscribe(message => {
      
      this.messages.push(message);

    });

    let today = new Date()

    let curHr = today.getHours()
    
    if (curHr >= 1 && curHr <= 12) {

      this.time.push('Good Morning '+ this.name + '. How can we help?')
 
    } else if (curHr > 12 && curHr <= 14) {

      this.time.push('Good Afternoon '+ this.name + '. How can we help?')

    } else if(curHr > 14 && curHr <= 19) {

      this.time.push('Good eveining '+ this.name + '. How can we help?')

    } else if(curHr > 19 && curHr < 24){

      this.time.push('How is your night '+ this.name + '? How can we help?')

    }

    if (!this.name || !this.email || !this.phone) {
      
      this.navCtrl.setRoot('LandingPage');

    }else{

      this.joinChat();
    }
    

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ContactPage');
    
  }

  ionViewWillEnter() {

    this.menuCtrl.close();
  }

  ionViewDidLeave() {

      this.menuCtrl.swipeEnable( true )
  }

  joinChat(){
    
    this.socket.connect()
  
    this.socket.emit('set-nickname', { username: this.name});
  
  }
    

  getMessages() {
    
    let observable = new Observable((observer) => {
  
      this.socket.on('queries', (data) => {
        
        if(data.text.chatid == 2){

          observer.next(data)

        }
  
      });

    })
  
    return observable;
  
  }

  sendMessage(){

    const messanger = {

      text : this.message,

      email: this.email,

      phone: this.phone,

      name : this.name,

      chatid : 2
    }

    this.messages.push({ text: messanger, from: this.name, created: new Date() });

    this.socket.emit('contact', { text: messanger});

    this.message = '';

  }

}
