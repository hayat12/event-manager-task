import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Placeholder card shown while a card grid loads: grey bars where the card text will be. */
@Component({
  selector: 'app-card-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-skeleton.html',
  styleUrl: './card-skeleton.scss',
})
export class CardSkeleton {}
