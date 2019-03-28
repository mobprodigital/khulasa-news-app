import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { RoutedEventEmitterService } from './services/routed-event-emitter/routed-event-emitter.service';
import { Network } from '@ionic-native/network/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Market } from '@ionic-native/market/ngx';
const config = {
  apiKey: 'AIzaSyB7sG23PibLsD-aa6vGO6lWX7rwLoB4e6w',
  authDomain: 'khulasanews-2d406.firebaseapp.com',
  databaseURL: 'https://khulasanews-2d406.firebaseio.com',
  projectId: 'khulasanews-2d406',
  storageBucket: 'khulasanews-2d406.appspot.com',
  messagingSenderId: '382652766340'
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    ToastController,
    AdMobFree,
    Firebase,
    Network,
    Device,
    Market,
    RoutedEventEmitterService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
