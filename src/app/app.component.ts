import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { filter, interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  ngOnInit() {
    const intervalSubscription = interval(1000).pipe(
      map((val) => { return val * 3 }),
      filter((val) => { return val % 2 === 0 })
    ).subscribe({
      next: (val) => { console.log(val) }
    })

    this.destroyRef.onDestroy(() => {
      intervalSubscription.unsubscribe();
    });
  }

}
