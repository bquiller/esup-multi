import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferencesPageRoutingModule } from './preferences-routing.module';

import { ProjectModuleService, SharedComponentsModule } from '@ul/shared';
import { PreferencesPage } from './preferences.page';

const initModule = (projectModuleService: ProjectModuleService) =>
  () => projectModuleService.initProjectModule({
    name: 'preferences',
    translation: true,
    menuItems: [{
      title: 'PREFERENCES.MENU',
      icon: 'settings',
      position: 999,
      routerLink: PreferencesPageModule.routerLink,
      type: 'burger',
    }]
  });

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    PreferencesPageRoutingModule,
  ],
  declarations: [PreferencesPage],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initModule,
    deps:[ProjectModuleService],
    multi: true
  }],
})
export class PreferencesPageModule {
  static routerLink = '/preferences';
}
