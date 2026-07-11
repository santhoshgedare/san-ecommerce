import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: readonly string[] | string[] | null | undefined, separator = ', '): string {
    return value?.filter(Boolean).join(separator) ?? '—';
  }
}
