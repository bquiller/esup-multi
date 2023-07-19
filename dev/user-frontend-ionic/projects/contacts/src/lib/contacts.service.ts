import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Contacts, EmailType, PhoneType } from '@capacitor-community/contacts';
import { getAuthToken } from '@ul/shared';
import { Observable } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

export interface Contact {
  name: string;
  firstname: string;
  phoneNumbers: string[];
  mobileNumbers: string[];
  mailAddresses: string[];
  assignments: string[];
}

export interface ContactsBody {
  type: string;
  value: string;
  authToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(
    @Inject('environment')
    private environment: any,
    private http: HttpClient,) { }

  public getContacts(body: ContactsBody): Observable<Contact[]> {
    return getAuthToken().pipe(
      take(1),
      filter(authToken => authToken != null),
      switchMap(authToken => this.fetchContacts(body, authToken)),
    );
  }
  public async contactAlreadyExists(user: Contact): Promise<boolean> {
    const { contacts: allContacts } = await Contacts.getContacts({projection: {emails: true}});
    const contactExists = allContacts.find((contact) => contact.emails?.find((email) =>
    user.mailAddresses.includes(email.address))) !== undefined;
    return contactExists;
  }

  public async createContact(user: Contact) {
    const phones = [];
    const emails = [];
      user.phoneNumbers.map(phone => (
        phones.push({
          type: PhoneType.Work,
          // eslint-disable-next-line id-blacklist
          number: phone,
        })
      ));
      user.mailAddresses.map(email => (
        emails.push({
          type: EmailType.Work,
          address: email,
        })
      ));
      await Contacts.createContact({
        contact: {
          name: { given: user.firstname, family: user.name },
          phones,
          emails,
        },
      });
  }

  private fetchContacts(body: ContactsBody, authToken: string): Observable<Contact[]>  {
    body.authToken = authToken;
    return this.http.post<Contact[]>(`${this.environment.apiEndpoint}/contacts`, body);
  }

}
