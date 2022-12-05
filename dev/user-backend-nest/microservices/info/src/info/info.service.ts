import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { catchError, map, Observable } from 'rxjs';
import { DirectusApi } from '../config/configuration.interface';
import { DirectusResponse } from './directus.response.dto';
import { DirectusInfo, Info } from './info.dto';

@Injectable()
export class InfoService {
  private readonly logger = new Logger(InfoService.name);
  private directusApiConfig: DirectusApi;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.directusApiConfig = this.configService.get<DirectusApi>('directusApi');
  }

  public getInfo(language: string): Observable<Info[]> {
    const url = `${this.directusApiConfig.apiUrl}/items/info`;

    return this.httpService
      .get<DirectusResponse<DirectusInfo[]>>(url, {
        params: {
          'filter[translations][languages_code][_eq]': language,
          'deep[translations][_filter][languages_code][_eq]': language,
          fields: '*,translations.*',
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.directusApiConfig.bearerToken}`,
        },
      })
      .pipe(
        catchError((err: any) => {
          const errorMessage = 'Unable to get directus data';
          this.logger.error(errorMessage, err);
          throw new RpcException(errorMessage);
        }),
        map((res) =>
          res.data.data.map(
            (info: DirectusInfo): Info => ({
              id: info.id,
              title: info.translations[0].title,
              content: info.translations[0].content,
              link: info.link,
              ssoService: info.ssoService,
            }),
          ),
        ),
      );
  }
}
