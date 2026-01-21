import { RequestHandler } from 'msw';
import { searchAppointeesMockHandler } from '../app/appointee/appointee.mock';

export const handlers: RequestHandler[] = [searchAppointeesMockHandler];
