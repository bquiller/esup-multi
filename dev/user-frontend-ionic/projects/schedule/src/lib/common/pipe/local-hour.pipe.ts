import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';

@Pipe({
    name: 'localHour',
    pure: false
})
export class LocalHourPipe implements PipeTransform {

    constructor(private translateService: TranslateService) { }

    transform(fullDate: string): string {
      const lang = this.translateService.currentLang || this.translateService.defaultLang;
      return format(new Date(fullDate), 'p', {locale: locale[lang]});
    }
}
