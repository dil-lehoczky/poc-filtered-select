import { HttpHandler, http, HttpResponse, delay } from 'msw';
import { AppointeeSearchRequestBody, AppointeeSearchResponse, Appointee } from './appointee.model';
import { faker } from '@faker-js/faker';

const mockSearchResult = faker.helpers.multiple<Appointee>(
  () => ({
    id: faker.string.nanoid(),
    name: faker.person.fullName(),
    jobTitle: faker.person.jobTitle(),
  }),
  { count: 50 },
);

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
  await delay(300);

  const { searchTerm } = await request.clone().json();
  if (searchTerm === 'error') {
    return HttpResponse.json(null, { status: 401 });
  }

  const filterRegexp = new RegExp(searchTerm, 'i');

  const filtered = mockSearchResult.filter(({ name }) => {
    return filterRegexp.test(name);
  });

  return HttpResponse.json(filtered);
});
