import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App } from 'ionic-angular';
import { SendPage } from '../send/send';
import { ReversePage } from '../reverse/reverse';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { StatusBar } from '@ionic-native/status-bar';
import { HeaderColor } from '@ionic-native/header-color';
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TransactionsPage } from '../transactions/transactions';
import { CardPage } from '../card/card';
import { ChatRoomPage } from '../chat-room/chat-room';
import { ChatPage } from '../chat/chat';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { RatesPage } from '../rates/rates';
import { AfricaPage } from '../africa/africa';

/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@IonicPage()

@Component({

  selector: 'page-landing',

  templateUrl: 'landing.html',

})


export class LandingPage {

  lastImage: string = null;

  _token: Array<{fname: string, lname: string}>

  lname: Array<{fname: string, lname: string}>

  msisdn:Array<{fname: string, lname: string}>

  rooming:Array<{fname: string, lname: string}>

  names : string

  myphoto : string

  email : any

  contact_us : any

  cards : any

  value = []

  stripe : any

  country : any

  constructor(public navCtrl: NavController, private app: App, public menuCtrl: MenuController, private headerColor: HeaderColor, private statusBar: StatusBar, private storage: Storage, private socket: Socket, public navParams: NavParams,public loadingCtrl: LoadingController, private http: HttpClient, private toastCtrl: ToastController, public platform: Platform, ) {

    this.storage.get('_token').then((val) => {

      if(val == null || val == undefined){

        return this.app.getRootNav().setRoot(HomePage);

      }else{

        this._token = val.data.fname;

        this.lname = val.data.lname;
  
        this.msisdn = val.data.msisdn
  
        this.names = val.data.fname + " " + val.data.lname
  
        this.email = val.data.email

        this.stripe = val.data.stripe_id

      }

    });

    this.storage.get('image').then((val) =>{
      
      this.myphoto = val
      
    })

    this.storage.get('country').then((val)=>{

      this.country = val

    })


    this.statusBar.backgroundColorByHexString('#757575');

  }
  
  ionViewDidLoad() { 

    console.log('ionViewDidLoad LandingPage');

  }

  ionViewWillEnter() {

    this.menuCtrl.close();

  }

  ionViewDidLeave() {

    this.menuCtrl.swipeEnable( true )

  }

  rates(){

      let loading = this.loadingCtrl.create({
        
        content: 'Please Wait...'

      });
    
      loading.present();
    
      setTimeout(() => {
        
        this.http.get('http://142.93.7.234:84/api/settings/ViewAllRates')
    
        .subscribe(ress => {
    
          console.log({'success':ress});
    
          this.navCtrl.push(RatesPage, {rating: ress});
          
        }, (err) => {
    
        console.log({'error':err});
    
          });


      }, 1000);

      setTimeout(() => {

        loading.dismiss();

      }, 3000);

  }

  contact(){

    this.navCtrl.push(ContactPage, {names: this.names, email: this.email, phone: this.msisdn})
    
  }

  money(){

    // go to the MyPage component

      this.navCtrl.push(SendPage);

  }

  reverse() {

    // go to the MyPage component

    this.navCtrl.push(ReversePage);

  }

  list() {

    // go to the MyPage component
    this.presentLoadingText()

  }

  card() {

    // go to the MyPage component

    let loading = this.loadingCtrl.create({

      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      console.log(this.stripe)
  
        const sending={
            
          stripe_id:this.stripe,
              
        }
    
        this.http.post('http://142.93.7.234:84/api/ViewAllCustomerCards/', sending)
    
        .subscribe(ress => {
  
          this.cards = ress

          this.navCtrl.push(CardPage, {value: this.cards});
          
        }, (err) => {
    
        console.log({'error':err});
    
        });
      
    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

  chat() {    

    // go to the MyPage component

        this.navCtrl.push(ChatPage, {name: this.names, phone: this.msisdn});

  }

  presentToast(message) {

    let toast = this.toastCtrl.create({

      message: message,

      duration: 3000,

      position: 'bottom'

    });
  
    toast.onDidDismiss(() => {

      console.log('Dismissed toast');

    });
  
    toast.present();
  }
  
  presentLoadingText() {

    console.log('ining')
    
    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      const auth = {
        
        number:this.msisdn,
  
      }

      if(this.msisdn == undefined || this.msisdn == null){

        this.presentLoadingText()
      }
      
      this.http.post('http://142.93.7.234:84/api/ViewParticularCustomersTransactions/', auth)
  
      .subscribe(ress => {
  
        console.log({'success':ress});
  
        this.navCtrl.push(TransactionsPage, {transact: ress});
        
      }, (err) => {
  
      console.log({'error':err});
  
        });


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  } 

}
