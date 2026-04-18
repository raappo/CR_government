import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    @if (loadingService.activeRequests() > 0) {
      <div class="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/35 backdrop-blur-sm">
        <div class="rounded-3xl bg-white/95 px-8 py-6 shadow-civic">
          <mat-spinner diameter="44" />
        </div>
      </div>
    }
  `
})
export class LoadingOverlayComponent {
  readonly loadingService = inject(LoadingService);
}
