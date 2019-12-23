import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {webSocket} from 'rxjs/webSocket';
import {multicast} from 'rxjs/operators';

@Injectable()
export class WebsocketService {
  constructor() {
  }

  public connect(url): Observable<unknown> {
    const subject = webSocket(url);
    console.log('Successfully connected: ' + url);
    subject.next({ message: '1' });
    return subject.pipe(multicast(() => subject));
  }
}
