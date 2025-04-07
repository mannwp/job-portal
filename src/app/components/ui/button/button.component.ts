import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { twMerge } from 'tailwind-merge';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      #buttonElement
      class="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      [class]="computedClasses"
      [disabled]="disabled"
      [type]="type"
      (click)="buttonClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent implements AfterViewInit {
  @ViewChild('buttonElement') buttonElement!: ElementRef<HTMLButtonElement>;

  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'default';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Additional classes to apply to the button
   */
  @Input() class = '';

  @Output() buttonClick = new EventEmitter<Event>();

  variantClasses: Record<ButtonVariant, string> = {
    default: 'bg-primary text-background hover:bg-primary/90',
    destructive: 'bg-destructive text-background hover:bg-destructive/90',
    outline:
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  sizeClasses: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8 text-base',
    icon: 'h-10 w-10',
  };

  baseClasses =
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  get computedClasses(): string {
    return twMerge(
      this.baseClasses,
      this.variantClasses[this.variant],
      this.sizeClasses[this.size],
      this.class
    );
  }

  ngAfterViewInit() {
    if (this.disabled) {
      this.buttonElement.nativeElement.setAttribute('aria-disabled', 'true');
    }
  }
}
