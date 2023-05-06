import {
  Activity,
  ConnectionStatus,
  IBotConnection
} from "botframework-directlinejs";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";

export class OfflineHistoryConnection implements IBotConnection {

  referenceGrammarId?: string | undefined;

  public connectionStatus$: BehaviorSubject<ConnectionStatus>;
  
  public activity$: Observable<Activity>;

  public constructor() {

    this.connectionStatus$ = new BehaviorSubject<ConnectionStatus>(
      ConnectionStatus.Ended
    );

    this.activity$ = new Observable<Activity>(
      (observer: Subscriber<Activity>) => {
        const activity: any = {};
        observer.next(activity);
      }
    ).share();
  }

  public end(): void {
    throw new Error("Method not implemented.");
  }

  public postActivity(activity: Activity): Observable<string> {
    return Observable.of(activity.id || "");
  }

  public getSessionId?: (() => Observable<string>) | undefined;
}
