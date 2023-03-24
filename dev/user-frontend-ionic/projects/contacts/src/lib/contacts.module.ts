import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectModuleService, SharedComponentsModule } from '@ul/shared';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsModuleConfig, CONTACTS_CONFIG } from './contacts.config';
import { ContactsComponent } from './contacts.page';


const initModule = (projectModuleService: ProjectModuleService) =>
  () => projectModuleService.initProjectModule({
    name: 'contacts',
    translation: true
  });

@NgModule({
  declarations: [
    ContactsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ContactsRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initModule,
    deps:[ProjectModuleService],
    multi: true
  }],
})
export class ContactsModule {
  static routerLink = '/contatcs';

  static forRoot(config: ContactsModuleConfig): ModuleWithProviders<ContactsModule> {
    return {
      ngModule: ContactsModule,
      providers: [
        { provide: CONTACTS_CONFIG, useValue: config }
      ]
    };
  }
}
