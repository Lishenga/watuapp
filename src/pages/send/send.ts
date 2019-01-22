import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Contacts, ContactFieldType, ContactField } from '@ionic-native/contacts';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';

/**
 * Generated class for the SendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-send',

  templateUrl: 'send.html',

})
export class SendPage {

  @ViewChild('input') myInput;

  @ViewChild(Slides) slides: Slides;

  sender = {

    amount:'',

    password:'',

    card:'',

    phone:'',

    recepient:'',

  }

  contacttobefound = '';

  contactfound : any;

  search = false;

  phone : any

  cards : any

  value = []

  pesa : any

  ourvalue : ContactFieldType[] = ['displayName'];

  _token: Array<{email: any, fname: string}>

  rater: any

  rat: any

  onesignal: any

  amount : any

  constructor(public navCtrl: NavController,  private socket: Socket, private contacts: Contacts, public alertCtrl: AlertController, public navParams: NavParams,private storage: Storage,public loadingCtrl: LoadingController, private http: HttpClient,private toastCtrl: ToastController) {

    this.contactfound = '';
    
    console.log(this.pesa)

    this.storage.get('oneSignal').then((val)=>{

      this.onesignal = val

    })

    this.storage.get('_token').then((val) => {

        const sending={
          
          stripe_id:val.data.stripe_id, 
              
        }
    
        this.http.post('http://142.93.7.234:84/api/ViewAllCustomerCards/', sending)
    
        .subscribe(ress => {

          this.cards = ress

          console.log(this.cards.data.data)

          for(let item of this.cards.data.data){

            this.value.push(item)

          }
          
        }, (err) => {
    
        console.log({'error':err});
    
        });

    });
 

  }

  confrimation(ress){

    this.amount = this.sender.amount

    let alert = this.alertCtrl.create({

      subTitle: 'Send Money',

      message: 'Do you want to send this amount ' + this.sender.amount + ' USD to '+ this.sender.phone + ' at a rate of 1 USD at '+ ress.selling +' KSH.Total amount: ' + ress.selling * this.amount +' KSH',

      buttons: [

        {
          text: 'Cancel',

          role: 'cancel',

          handler: () => {

            console.log('Cancel clicked');

          }

        },

        {

          text: 'Send',

          handler: () => {

            this.presentLoadingText();

          }

        }

      ]

    });

    alert.present();
    
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SendPage');

  }

  slideChanged() {

    let currentIndex = this.slides.slideNext(200, true);

    console.log('Current index is', currentIndex);

  }

  send(){

    if(this.sender.amount == '' || this.sender.password == ''|| this.sender.recepient == ''){

      return

    }else{
      
      if(this.sender.recepient === 'M-PESA'){

        this.storage.get('currency').then((val)=>{
  
          this.http.get('http://142.93.7.234:84/api/settings/ViewAllRates')
    
            .subscribe(ress => {
        
              console.log({'success':ress});

              this.rater = ress

              for(let item of this.rater.data){

                this.confrimation(item)
      
              }
              
            }, (err) => {
        
            console.log({'error':err});
        
              });

            })

      }else if(this.sender.recepient === 'CARD'){

      this.http.get('http://142.93.7.234:84/api/settings/ViewAllRates')
  
          .subscribe(ress => {
      
            console.log({'success':ress});

            this.rat = ress

            this.amount = this.sender.amount

            for(let item of this.rat.data){

            let alert = this.alertCtrl.create({

              subTitle: 'Send Money',
        
              message: 'Do you want to send this amount ' + this.sender.amount + ' USD to '+ this.sender.phone + ' at a rate of 1 USD at '+ item.selling +' KSH.Total amount: ' + item.selling * this.amount +' KSH',
        
              buttons: [ 
        
                {
                  text: 'Cancel',
        
                  role: 'cancel',      
        
                  handler: () => {
        
                    console.log('Cancel clicked');
        
                  }
        
                },
        
                {
        
                  text: 'Send',
        
                  handler: () => {
        
                    this.presentLoadingText();
        
                  }
        
                }
        
              ]
        
            });
        
            alert.present();

          }
            
          }, (err) => {
      
          console.log({'error':err});
      
            });

      }

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
  
        subTitle: this.sender.amount + ' USD sent to ' + this.sender.phone,
  
        buttons: ['OK']
  
      });
  
      alert.present();

      this.sender.amount = '';
    
      this.sender.password = '';

      this.sender.card = '';

      this.sender.phone = '';

      this.sender.recepient = '';

      this.socket.emit('money', { text: 'Transaction Successful', oneSignal: this.onesignal});

    }else{

      let alert = this.alertCtrl.create({
        
        title: 'Unsuccessful!',
  
        subTitle: "Kindly Try Again",
  
        buttons: ['OK']
  
      });
  
      alert.present();

      this.socket.emit('money', { text: 'Transaction Unsuccessful', oneSignal: this.onesignal});
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

      this.storage.get('currency').then((val) =>{

        if(this.sender.phone === this.contactfound.displayName){  

          const bodys={
          
            email:this._token,
      
            amount:this.sender.amount,
      
            number:this.phone,
  
            currency: 'USD'
                  
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
    
                this.showAlert(res)
                
            }, (err) => {
      
              console.log({'error':err});
    
              this.sender.amount = '';
    
              this.sender.password = '';

              this.sender.card = '';

              this.sender.phone = '';

              this.sender.recepient = '';
      
              this.showAlert({status_code: 500})
      
            });
              
          }, (err) => {
      
            console.log({'error':err});
    
            this.sender.amount = '';
    
            this.sender.password = '';

            this.sender.card = '';

            this.sender.phone = '';

            this.sender.recepient = '';
      
            this.showAlert({status_code: 500})
      
          });
  
        }else{
  
          const bodys={
          
            email:this._token,
      
            amount:this.sender.amount,
      
            number:this.sender.phone,

            currency: 'USD'
                  
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
    
                this.showAlert(res)
                
            }, (err) => {
      
              console.log({'error':err});
    
              this.sender.amount = '';
    
              this.sender.password = '';

              this.sender.card = '';

              this.sender.phone = '';

              this.sender.recepient = '';
      
              this.showAlert({status_code: 500})
      
            });
              
          }, (err) => {
      
            console.log({'error':err});
    
            this.sender.amount = '';
    
            this.sender.password = '';

            this.sender.card = '';

            this.sender.phone = '';

            this.sender.recepient = '';
      
            this.showAlert({status_code: 500})
      
          });
  
        }


      })


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}