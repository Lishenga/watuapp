import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const configs : SocketIoConfig = { url: 'https://sockets-watu.herokuapp.com/', options: {} };
import { CacheModule } from "ionic-cache";

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';


import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login'; 
import { ForgotPage } from '../pages/forgot/forgot';
import { CreatePage } from '../pages/create/create';
import { LandingPage } from '../pages/landing/landing';
import { ReversePage } from '../pages/reverse/reverse';
import { SendPage } from '../pages/send/send';
import { TransactionsPage } from '../pages/transactions/transactions';
import { CardPage } from '../pages/card/card';
import { ChatPage } from '../pages/chat/chat';
import { ChatRoomPage } from '../pages/chat-room/chat-room';
import { PasswordPage } from '../pages/password/password';
import { CheckPage } from '../pages/check/check';
import { FirstLoginPage } from '../pages/first-login/first-login';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { RatesPage } from '../pages/rates/rates';
import { AfricaPage } from '../pages/africa/africa';

import { Contacts, ContactFieldType} from '@ionic-native/contacts';
import { OneSignal } from '@ionic-native/onesignal';
import { HeaderColor } from '@ionic-native/header-color';
import { Toast } from '@ionic-native/toast';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker'; 
import { CardPageModule } from '../pages/card/card.module';
import { ChatPageModule } from '../pages/chat/chat.module';
import { CheckPageModule } from '../pages/check/check.module';
import { CreatePageModule } from '../pages/create/create.module';
import { FirstLoginPageModule } from '../pages/first-login/first-login.module';
import { ForgotPageModule } from '../pages/forgot/forgot.module';
import { LoginPageModule } from '../pages/login/login.module';
import { ReversePageModule } from '../pages/reverse/reverse.module';
import { SendPageModule } from '../pages/send/send.module';
import { TransactionsPageModule } from '../pages/transactions/transactions.module';
import { PasswordPageModule } from '../pages/password/password.module';
import { LandingPageModule } from '../pages/landing/landing.module';
import { ContactPageModule } from '../pages/contact/contact.module';
import { HomePageModule } from '../pages/home/home.module';
import { ChatRoomPageModule } from '../pages/chat-room/chat-room.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { RatesPageModule } from '../pages/rates/rates.module';
import { AfricaPageModule } from '../pages/africa/africa.module';

import { OneSignalProvider } from '../providers/one-signal/one-signal';



@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CardPageModule,
    ChatPageModule,
    HomePageModule,
    CheckPageModule,
    CreatePageModule,
    FirstLoginPageModule,
    ForgotPageModule,
    LandingPageModule,
    SendPageModule,
    PasswordPageModule,
    TransactionsPageModule,
    ReversePageModule,
    LoginPageModule,
    ContactPageModule,
    ChatRoomPageModule,
    ProfilePageModule,
    SettingsPageModule,
    RatesPageModule, 
    AfricaPageModule,    
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    CacheModule.forRoot(),
    IonicStorageModule.forRoot(),
    SocketIoModule.forRoot(configs),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    LoginPage,
    ForgotPage,
    CreatePage,
    LandingPage,
    ReversePage,
    SendPage,
    ChatPage,
    CardPage,
    RatesPage,
    ContactPage,
    ProfilePage,
    TransactionsPage,
    PasswordPage,
    CheckPage,
    ChatRoomPage,
    FirstLoginPage,
    SettingsPage,
    AfricaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    OneSignalProvider,
    HeaderColor,
    Contacts,
    File,
    FileTransfer,
    FileTransferObject,
    Camera,
    FilePath,
    ImagePicker,
    Toast,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    OneSignalProvider,
  ]
})
export class AppModule {}