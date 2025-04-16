import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  ngOnInit() {
    const intervalSubscription = interval(5000).subscribe({
      next: (val) => { console.log(val) }
    })

    this.destroyRef.onDestroy(() => {
      intervalSubscription.unsubscribe();
    });
  }

}
