import { QueryFailedError } from 'typeorm';
import debug from '~/debug';
import { Link } from '~/entity';

class LinkService {
  public getDestinationUrlAndCount = async (shortUrl: string) => {
    try {
      const foundLink = await Link.findOne({
        where: {
          shortUrl,
        },
      });

      if (foundLink) {
        foundLink.hits += 1;
        foundLink.save();
        return foundLink.destinationUrl;
      }
    } catch (e) {
      if (e instanceof QueryFailedError) {
        return null;
      }

      debug('error:redirect')(e);
      throw e;
    }
  };

  public getUrls = async () => {
    return Link.find();
  };

  public getSimilarUrls = async (shortUrl: string) => {
    interface ILinkAndDistance extends Link {
      distance: number;
    }

    const listOfLinks: ILinkAndDistance[] = await Link.query(
      `
      SELECT
        link.id,
        link.shortUrl,
        link.destinationUrl,
        link.hits,
        jaro_winkler_similarity(link.shorturl, ?) as distance
      FROM
        link
      ORDER BY
        distance desc
    `,
      [shortUrl],
    );

    return listOfLinks;
  };

  public deleteUrl = async (id: number) => {
    return Link.delete({ id });
  };
}

export default new LinkService();
