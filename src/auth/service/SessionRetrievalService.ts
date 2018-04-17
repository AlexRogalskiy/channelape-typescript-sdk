import CredentialSessionRequest from './../model/CredentialSessionRequest';
import * as Q from 'q';
import * as log4js from 'log4js';
import SessionResponse from './../model/SessionResponse';
import { Client } from 'node-rest-client';
import Endpoint from '../../model/Endpoint';
import Version from '../../model/Version';
import SessionIdSessionRequest from './../model/SessionIdSessionRequest';

const STARTING_TO_RETRIEVE_MESSAGE = 'Retrieving session';
const LOGGER_ID = 'SessionRetrievalService';
const FATAL_ERROR_MESSAGE = 'FATAL ERROR making restful request to retrieve: ';

export default class SessionRetrievalService {

  private logger : log4js.Logger = log4js.getLogger(LOGGER_ID);

  constructor(private client: any, private endpoint: string) {}

  retrieveSession(
    sessionRequest: SessionIdSessionRequest | CredentialSessionRequest) {
    if ((sessionRequest as SessionIdSessionRequest).sessionId != null) {
      return this.retrieveSessionBySessionId((sessionRequest as SessionIdSessionRequest));
    }

    return this.retrieveSessionByCredentials(sessionRequest as CredentialSessionRequest);
  }

  private retrieveSessionByCredentials(
    sessionRequest: CredentialSessionRequest): Q.Promise<SessionResponse> {

    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const deferred = Q.defer<SessionResponse>();
    const requestUrl = `${this.endpoint}/${Version.V1}${Endpoint.SESSIONS}`;
    this.logger.debug(`HTTP Request: POST ${requestUrl}`);
    const req = this.client.post(requestUrl, [], (res: SessionResponse, data: any) => {
      deferred.resolve(res);
    });

    req.on('error', (err: any) => {
      this.logger.error(`${FATAL_ERROR_MESSAGE}${err}`);
      deferred.reject(err);
    });
    return deferred.promise;
  }

  private retrieveSessionBySessionId(
    sessionRequest: SessionIdSessionRequest): Q.Promise<SessionResponse> {

    this.logger.info(STARTING_TO_RETRIEVE_MESSAGE);
    const deferred = Q.defer<SessionResponse>();
    const requestUrl = `${this.endpoint}/${Version.V1}${Endpoint.SESSIONS}/${sessionRequest.sessionId}`;
    this.logger.debug(`HTTP Request: GET ${requestUrl}`);
    const req = this.client.get(requestUrl, [], (res: SessionResponse, data: any) => {
      deferred.resolve(res);
    });

    req.on('error', (err: any) => {
      this.logger.error(`${FATAL_ERROR_MESSAGE}${err}`);
      deferred.reject(err);
    });
    return deferred.promise;
  }
}
