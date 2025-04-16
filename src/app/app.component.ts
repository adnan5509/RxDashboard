import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { filter, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  clickCounter = signal(0);
  fade = true;

  constructor() {
    effect(() => {
      console.log('Click count:', this.clickCounter());
    })
  }

  private destroyRef = inject(DestroyRef);
  ngOnInit() {
    // const intervalSubscription = interval(1000).pipe(
    //   map((val) => { return val * 3 }),
    //   filter((val) => { return val % 2 === 0 })
    // ).subscribe({
    //   next: (val) => { console.log(val) }
    // })

    // this.destroyRef.onDestroy(() => {
    //   intervalSubscription.unsubscribe();
    // });
  }

  onClick() {
    this.fade = false; // reset animation
    this.clickCounter.update(val => val + 1);

    setTimeout(() => {
      this.fade = true;
    }, 50); // brief timeout to re-trigger animation
  }
}