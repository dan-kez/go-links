import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import queryString from 'query-string';
import React, { Suspense } from 'react';
import CreateLinkForm from './CreateLinkForm';
import LinkTable from './LinkTable';

const BodySection = () => {
  const queryStringParams = queryString.parse(window.location.search);
  const { shortUrl: defaultShortUrl = '' } = queryStringParams;

  return (
    <Grid container spacing={16} direction="column">
      <Grid item>
        {queryStringParams.re && (
          <Card>
            <CardContent>
              <Typography color="error">
                The requested short url, "{window.location.protocol}
                {'//'}
                {window.location.host}/{defaultShortUrl}", does not exist.
              </Typography>
              <Typography color="error">
                See the table below for similar urls, or create a new one.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Grid item>
        <CreateLinkForm defaultShortUrl={defaultShortUrl.toString()} />
      </Grid>
      <Grid item>
        <Suspense fallback={<CircularProgress size="32px" />}>
          <LinkTable defaultShortUrl={defaultShortUrl.toString()} />
        </Suspense>
      </Grid>
    </Grid>
  );
};

export default BodySection;
