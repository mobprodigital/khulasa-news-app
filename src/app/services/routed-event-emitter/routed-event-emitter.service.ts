import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutedEventEmitterService {


  public eventEmitter = new EventEmitter();

  constructor() { }

  /**
   * Send news message with data
   * @param data data to send
   */
  public sendMessage(data: any) {
    this.eventEmitter.emit({
      data: data
    });
  }




}
