import axios from 'axios';

export const similarShortUrls = (shortUrl: string | undefined = '') =>
  axios.get(`/api/similar?shortUrl=${shortUrl}`);

export const deleteUrl = (id: number) => axios.delete(`/api/link/${id}`);

export const addLinkAPI = (shortUrl: string, destinationUrl: string) =>
  axios.post(
    '/api/link',
    {
      shortUrl,
      destinationUrl,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

export const addOrUpdateLinkAPI = (shortUrl: string, destinationUrl: string) =>
  axios.put(
    '/api/link',
    {
      shortUrl,
      destinationUrl,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
