import * as bodyParser from 'body-parser';
import express from 'express';
import debug from '~/debug';
import { Link } from '~/entity';
import LinkService from '~/services/LinkService';

class App {
  public app: express.Application = express();

  constructor() {
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.set('etag', false);
    this.app.enable('trust proxy');
  }

  private routes(): void {
    const router = express.Router();

    router.get('/api/similar', async (req, res) => {
      const shortUrl: string = req.query.shortUrl || '';

      try {
        const similarOptions = await LinkService.getSimilarUrls(shortUrl);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(similarOptions));
      } catch (e) {
        debug('error:similar')(e);
      }
      res.status(500);
    });

    router.put('/api/link', async (req, res) => {
      const { shortUrl, destinationUrl } = req.body;
      const { ip } = req;
      if (!shortUrl || !destinationUrl) {
        res.status(400).send();
        return;
      }

      try {
        const foundLink = await Link.findOne({ where: { shortUrl } });
        if (foundLink) {
          foundLink.destinationUrl = destinationUrl;
          foundLink.save();
          res.status(200).send();
        } else {
          const newLink = new Link();
          newLink.shortUrl = shortUrl;
          newLink.destinationUrl = destinationUrl;
          newLink.ipAddress = ip;
          await newLink.save();
          res.status(201).send();
        }
      } catch (e) {
        debug('error:failedPut')(e);
      }
      res.status(500).send();
    });

    router.post('/api/link', async (req, res) => {
      const { shortUrl, destinationUrl } = req.body;
      const { ip } = req;
      if (!shortUrl || !destinationUrl) {
        res.status(400).send();
        return;
      }
      const newLink = new Link();
      try {
        newLink.shortUrl = shortUrl;
        newLink.destinationUrl = destinationUrl;
        newLink.ipAddress = ip;
        await newLink.save();
        res.status(201).send();
      } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
          res.status(409).send();
        }
        debug('error:failedPost')(e);
      }
      res.status(500).send();
    });

    router.delete('/api/link/:id', async (req, res) => {
      const id = req.params.id;

      try {
        LinkService.deleteUrl(id);
        res.status(200).send();
      } catch (e) {
        debug('error:failedDelete')(e);
      }
      res.status(500).send();
    });

    router.get('/node-app-health-check', (req, res) => {
      res.status(200).send();
    });

    router.get(/\/.*/, async (req, res) => {
      const shortUrl = req.path.substr(1) || '';

      try {
        const destinationUrl = await LinkService.getDestinationUrlAndCount(
          shortUrl,
        );
        if (destinationUrl) {
          res.redirect(destinationUrl);
        }
      } catch (e) {
        debug('error:redirect')(e);
      }
      res.redirect(`/?re=1&shortUrl=${encodeURIComponent(shortUrl)}`);
    });
    this.app.use('/', router);
  }
}

export default new App().app;
