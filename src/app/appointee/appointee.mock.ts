import { HttpHandler, http, HttpResponse } from 'msw';
import { AppointeeSearchRequestBody, AppointeeSearchResponse } from './appointee.model';

export const searchAppointeesMockHandler: HttpHandler = http.post<
  never,
  AppointeeSearchRequestBody,
  AppointeeSearchResponse
>('/appointee-search', ({ request }) => {
  return HttpResponse.json([{ id: 'asd', name: 'John', jobTitle: 'janitor' }]);
});
