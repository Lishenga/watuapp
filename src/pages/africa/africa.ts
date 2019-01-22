import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import { Contacts, ContactFieldType, ContactField } from '@ionic-native/contacts';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';

/**
 * Generated class for the AfricaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-africa',

  templateUrl: 'africa.html',

})

export class AfricaPage {

  @ViewChild('input') myInput;

  @ViewChild(Slides) slides: Slides;

  sender = {

    amount:'',

    password:'',

    card:'',

    phone:'',

  }

  contacttobefound = '';

  contactfound : any;

  search = false;

  phone : any

  cards : any

  value = []

  ourvalue : ContactFieldType[] = ['displayName'];

  _token: Array<{email: any, fname: string}>

  constructor(public navCtrl: NavController, private contacts: Contacts, public alertCtrl: AlertController, public navParams: NavParams,private storage: Storage,public loadingCtrl: LoadingController, private http: HttpClient,private toastCtrl: ToastController) {

    this.contactfound = '';

    this.storage.get('_token').then((val) => {

        const sending={
          
          stripe_id:val.data.stripe_id,
              
        }
    
        console.log(sending)
    
        this.http.post('http://142.93.7.234:84/api/ViewAllCustomerCards/', sending)
    
        .subscribe(ress => {

          this.cards = ress

          for(let item of this.cards.data.data){

            this.value.push(item)

          }
          
        }, (err) => {
    
        console.log({'error':err});
    
        });

    });
 

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad AfricaPage');

  }

  slideChanged() {

    let currentIndex = this.slides.slideNext(200, true);

    console.log('Current index is', currentIndex);

  }

  send(){

    if(this.sender.amount == '' || this.sender.password == ''){

      return

    }else{

      this.presentLoadingText()

    }
  
  }

  findfn(){

    this.contacts.pickContact().then((contacts)=>{

      this.contactfound = contacts

      contacts.phoneNumbers.forEach(numero => {

        this.phone = numero.value

      });

    })

    if(this.contactfound == null || this.contactfound == undefined){

      this.contactfound.push({displayName: 'No Contacts Found'});

      this.search = true;
    }

  }


  showAlert(res) {

    if(res.status_code == 200){

      let alert = this.alertCtrl.create({
        
        title: 'Success!',
  
        subTitle: this.sender.amount+" sent to "+ this.phone,
  
        buttons: ['OK']
  
      });
  
      alert.present();

    }else{

      let alert = this.alertCtrl.create({
        
        title: 'Unsuccessful!',
  
        subTitle: "Kindly Try Again",
  
        buttons: ['OK']
  
      });
  
      alert.present();
    }

  }
  

  presentToast() {

    let toast = this.toastCtrl.create({

      message: 'Kindly fill in all the fields',

      duration: 3000,

      position: 'bottom',

      showCloseButton: true,

      closeButtonText: 'Got it!',

      dismissOnPageChange: true,

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

      this.storage.get('_token').then((val) => {
        
        this._token = val.data.email;
  
      })

      if(this._token == null || this._token == undefined){
        
        return this.presentLoadingText()

      }

      if(this.sender.phone =='' || this.sender.phone == null || this.sender.phone == undefined){

        const bodys={
        
          email:this._token,
    
          amount:this.sender.amount,
    
          number:this.phone,
                
        }

        const sending={
        
          email:this._token,
    
          password:this.sender.password,
              
        }
            
        this.http.post('http://142.93.7.234:84/api/AuthenticateUser/', sending)
    
          .subscribe(res => {
    
            console.log({'success':res});
    
            this.http.post('http://142.93.7.234:84/api/CreateStripeCardCharge/', bodys)
    
            .subscribe(res => {
    
              console.log({'success':res});
    
              this.storage.set('_token',res)
  
              this.sender.amount = '';
  
              this.sender.password = '';
  
              this.showAlert(res)
              
          }, (err) => {
    
            console.log({'error':err});
  
            this.sender.amount = '';
  
            this.sender.password = '';
    
            this.showAlert({status_code: 500})
    
          });
            
        }, (err) => {
    
          console.log({'error':err});
  
          this.sender.amount = '';
  
          this.sender.password = '';
    
          this.showAlert({status_code: 500})
    
        });

      }else{

        const bodys={
        
          email:this._token,
    
          amount:this.sender.amount,
    
          number:this.sender.phone,
                
        }

        const sending={
        
          email:this._token,
    
          password:this.sender.password,
              
        }
            
        this.http.post('http://142.93.7.234:84/api/AuthenticateUser/', sending)
    
          .subscribe(res => {
    
            console.log({'success':res});
    
            this.http.post('http://142.93.7.234:84/api/CreateStripeCardCharge/', bodys)
    
            .subscribe(res => {
    
              console.log({'success':res});
    
              this.storage.set('_token',res)
  
              this.sender.amount = '';
  
              this.sender.password = '';
  
              this.showAlert(res)
              
          }, (err) => {
    
            console.log({'error':err});
  
            this.sender.amount = '';
  
            this.sender.password = '';
    
            this.showAlert({status_code: 500})
    
          });
            
        }, (err) => {
    
          console.log({'error':err});
  
          this.sender.amount = '';
  
          this.sender.password = '';
    
          this.showAlert({status_code: 500})
    
        });

      }


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }
}
