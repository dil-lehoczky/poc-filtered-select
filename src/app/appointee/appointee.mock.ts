import { HttpHandler, http, HttpResponse } from 'msw';
import { AppointeeSearchRequestBody, AppointeeSearchResponse, Appointee } from './appointee.model';
import { faker } from '@faker-js/faker';

const mockSearchResult = faker.helpers.multiple<Appointee>((_, i) => ({
  id: faker.string.nanoid(),
  name: faker.person.fullName(),
  jobTitle: faker.person.jobTitle(),
}));

const repeatedName = 'David Bate';
mockSearchResult.push(
  {
    id: faker.string.nanoid(),
    name: repeatedName,
    jobTitle: faker.person.jobTitle(),
  },
  {
    id: faker.string.nanoid(),
    name: repeatedName,
    jobTitle: faker.person.jobTitle(),
  },
);

export const searchAppointeesMockHandler: HttpHandler = http.post<
  never,
  AppointeeSearchRequestBody,
  AppointeeSearchResponse
>('/appointee-search', async ({ request }) => {
  const { searchTerm } = await request.clone().json();
  const filterRegexp = new RegExp(searchTerm, 'i');

  const filtered = mockSearchResult.filter(({ name }) => {
    return filterRegexp.test(name);
  });

  return HttpResponse.json(filtered);
});
