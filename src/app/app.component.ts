import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, takeWhile, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCounter = signal(0);
  clickCounter$ = toObservable(this.clickCounter);

  interval$ = interval(200).pipe(takeWhile((val) => val <= 50));
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  userWinning = false;
  currentResultMessage = signal('Click the button to start counting...');
  fade = true;

  private destroyRef = inject(DestroyRef);

  //  Custom Observable using `new Observable`
  customInterval$ = new Observable<boolean>((subscriber) => {
    const intervalId = setInterval(() => {
      const intervalVal = this.intervalSignal();
      const clickVal = this.clickCounter();

      if (intervalVal >= 50) {
        subscriber.complete(); // end observable
        clearInterval(intervalId);
      }

      if (clickVal > intervalVal) {
        subscriber.next(true);
      } else {
        subscriber.next(false);
      }
    }, 200);
  });

  ngOnInit() {
    //  React to emitted values from the custom observable
    const customIntervalSubscription = this.customInterval$.subscribe({
      next: (val) => {
        this.userWinning = val;
        this.currentResultMessage.set(val ? 'You are winning!' : 'You are losing! Fast click!');
      },
      complete: () => {
        this.currentResultMessage.set(this.userWinning ? 'You won!' : 'You lost!');
      }
    });

    this.destroyRef.onDestroy(() => {
      customIntervalSubscription.unsubscribe();
    });

    // Optional click logging
    const clickCounterSubscription = this.clickCounter$.subscribe({
      next: () => console.log('Click count:', this.clickCounter())
    });

    this.destroyRef.onDestroy(() => {
      clickCounterSubscription.unsubscribe();
    });
  }

  onClick() {
    this.fade = false;
    if (this.intervalSignal() <= 50 && this.clickCounter() <= 50) {
      this.clickCounter.update(val => val + 1);
    }

    setTimeout(() => {
      this.fade = true;
    }, 50);
  }
}
