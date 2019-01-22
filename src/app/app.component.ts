import { Component, ViewChild, } from '@angular/core';
import { App, Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LandingPage } from '../pages/landing/landing';
import { CreatePage } from '../pages/create/create';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { ReversePage } from '../pages/reverse/reverse';
import { HttpClient } from '@angular/common/http';
import { CacheService } from "ionic-cache";
import { OneSignalProvider } from '../providers/one-signal/one-signal';
import { Contacts, ContactFieldType, ContactField } from '@ionic-native/contacts';

@Component({

  templateUrl: 'app.html'

})
export class MyApp {

  rootPage: any 

  pages: Array<{title: string, component: any}>

  numbers : ContactFieldType[] = ['name']

  stripe: any

  lname: Array<{fname: string, lname: string}>

  id: any

  name: any

  email: any

  sockets: any

  names: any

  msisdn: any

  allcontacts: any

  online: any

  data : any

  _token: any

  fname: Array<{fname: string, lname: string}>

  myphoto : string

  constructor(platform: Platform, cache: CacheService, private contacts: Contacts, public loadingCtrl: LoadingController, private headerColor: HeaderColor, private statusBar: StatusBar, private http: HttpClient, splashScreen: SplashScreen,private storage: Storage,private app: App, OneSignalProvider: OneSignalProvider,) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();

      this.storage.get('_token').then((val) => {
        
        this._token = val;
  
        if(this._token) {

          this.lname = val.data.lname;
        
          this.fname = val.data.fname;

          this.msisdn = val.data.msisdn
  
          this.names = val.data.fname + " " + val.data.lname
    
          this.email = val.data.email
  
          this.app.getRootNav().setRoot(LandingPage);
  
        }else{

          this.rootPage = HomePage
        }
  
      });

      this.storage.get('image').then((val) =>{

        this.myphoto = val
        
      })

      this.pages = [

        { title: 'Home', component: HomePage }
        
      ];

      OneSignalProvider.init()

      OneSignalProvider.id()

      this.statusBar.backgroundColorByHexString('#757575');

      this.headerColor.tint('#757575');
      
      cache.setDefaultTTL(60 * 60); //set default cache TTL for 1 hour
      
      let lastDigestRun = new Date();

       function detectIdle() {

        let now = new Date();

        if (this.now - this.lastDigestRun > 10*60*60) {

           this.logout();

        }

        lastDigestRun = now;

      };

      this.storage.get("oneSignal").then((val) =>{
        
        if(val == null || val == undefined){

          OneSignalProvider.init()
          
          OneSignalProvider.id()

        }
        
      })

      http.get('http://142.93.7.234:84/api/GetAllCustomers/')
      
        .subscribe(ress => {
    
          this.storage.set('soc',ress)
    
          console.log({'success':ress});
          
        }, (err) => {
    
        console.log({'error':err});
    
        });

      this.storage.get("soc").then((val) =>{
        
        this.contacts.find(this.numbers).then((value) =>{
          
          let data_info=[]

          for (let _i = 0; _i < value.length; _i++) {

            let num = value[_i];

            if (num.phoneNumbers == null)continue;

            num.phoneNumbers.forEach(numero => {

              let user = {

                'name':num.displayName,

                'phone':numero.value

              }

              let phone = numero.value

              data_info.push({

                phone:user

              })

            });

          }

          let build = []
          
          for(let item of val.data){

            build.push(item.msisdn);

          }

          let checklist  = new Set(data_info);

          let validList = build.filter((item) => {

            return !checklist.has(item);

          })

          let final = []

          for (let _i = 0; _i < data_info.length; _i++) {

            let dets = data_info[_i]

            for(let net of validList){

              if(dets.phone.phone == net || dets.phone.phone == +'0'+ net || dets.phone.phone == +'+254'+ net){

                let datas = {

                  user:dets.phone.name,

                  phone:net

                }

                final.push(datas)
                
                this.storage.set('finalusers',final)
              }

            }

          }

        })

      }) 

    });

  }


  logout(){
    // go to the MyPage component
    
      this.presentLoadingText()
   
  }

  home(){

    this.app.getRootNav().setRoot(LandingPage);

  }

  profile() {

    // go to the MyPage component

    this.app.getRootNav().setRoot(ReversePage);

  }

  settings(){

    this.app.getRootNav().setRoot(SettingsPage); 

  }

  contact(){

    this.app.getRootNav().setRoot(ContactPage, {names: this.names, email: this.email, phone: this.msisdn});
    
  }

  presentLoadingText() {
    
    console.log('ining')

    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      this.storage.remove('_token').then((val) => {
        
        this.storage.remove('allcards').then((val) => {

          this.storage.remove('transactions').then((val) => {

            this.storage.remove('password').then((val) => {

              this.storage.remove('cards').then((val) => {

                this.storage.remove('finalusers').then((val) =>{

                  this.app.getRootNav().setRoot(LoginPage);

                })

              });

            });

          });

        });

      });
      
    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);
    
  }
  
}
