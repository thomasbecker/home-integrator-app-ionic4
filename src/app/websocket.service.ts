import {Injectable} from '@angular/core';
import {Subject, Observable, Observer} from 'rxjs';

@Injectable()
export class WebsocketService {
  constructor() {
  }

  public connect(url): Subject<MessageEvent> {
    const subject = this.create(url);
    console.log('Successfully connected: ' + url);
    return subject;
  }

  private create(url): Subject<MessageEvent> {
    const ws = new WebSocket(url);
    ws.onopen = function () {
      ws.send('1'); // needed to get the stream going
    }
    const observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      })
    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('1');
        }
      }
    }
    return Subject.create(observer, observable);
  }

}
