import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectModuleService } from '@ul/shared';
import { RelativeTimePipe } from './relative-time-pipe';
import { RssPageRoutingModule } from './rss-routing.module';
import { RssPage } from './rss.page';

const initModule = (projectModuleService: ProjectModuleService) =>
  () => projectModuleService.initProjectModule({
    name: 'rss',
    translation: true,
    menuItems: [{
      title: 'RSS.MENU',
      icon: 'logo-rss',
      position: 50,
      routerLink: RssPageModule.routerLink,
      type: 'top'
    }]
  });
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RssPageRoutingModule,
    TranslateModule
  ],
  declarations: [
    RssPage,
    RelativeTimePipe
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initModule,
    deps:[ProjectModuleService],
    multi: true
  }],
})
export class RssPageModule {
  static routerLink = '/rss';
}
