import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { Delete as DeleteIcon } from '@material-ui/icons';
import fuzzysort from 'fuzzysort';
import React, { ChangeEvent, useState } from 'react';
import { unstable_createResource as createResource } from 'react-cache';
import ReactTable, { Column } from 'react-table';
import { deleteUrl, similarShortUrls } from './apis';

const similarShortUrlsResource = createResource((shortUrl: string) =>
  similarShortUrls(shortUrl).then(res => res.data),
);

interface IClickRow {
  id: number;
  hits: number;
  shortUrl: string;
  destinationUrl: string;
}

const LinkTable: React.FC<{
  defaultShortUrl: string;
}> = ({ defaultShortUrl }) => {
  const initialData: IClickRow[] = similarShortUrlsResource.read(
    defaultShortUrl,
  );
  const [data, setData] = useState(initialData);
  const [page, changePage] = useState(0);

  const columns: Column[] = [
    {
      accessor: 'shortUrl',
      Header: 'Short Url',
      Cell: ({ value }) => (
        <Button
          fullWidth
          href={`/${value}`}
          style={{
            textTransform: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography noWrap>
            {window.location.protocol}
            {'//'}
            {window.location.host}/{value}
          </Typography>
        </Button>
      ),
      style: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    {
      accessor: 'destinationUrl',
      Header: 'Destination Url',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
      },
      Cell: ({ value }) => <Typography noWrap>{value}</Typography>,
    },
    {
      accessor: 'hits',
      Header: 'Hits',
      width: 100,
      style: {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      Cell: ({ value }) => <Typography noWrap>{value}</Typography>,
    },
    {
      accessor: 'id',
      Header: 'Delete',
      width: 100,
      style: {
        display: 'flex',
        justifyContent: 'center',
      },
      Cell: ({ value }) => (
        <IconButton
          color="secondary"
          aria-label="Delete"
          onClick={() => {
            deleteUrl(value);
            setData(data.filter(({ id }) => id !== value));
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const filterRows = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setData(
        fuzzysort
          .go(e.target.value, initialData, {
            keys: ['shortUrl', 'destinationUrl'],
            allowTypo: true,
            // Create a custom combined score to sort by. -100 to the desc score makes it a worse match
            scoreFn: a =>
              Math.max(
                a[0] ? a[0].score : -1000,
                a[1] ? a[1].score - 100 : -1000,
              ),
          })
          .map(({ obj }) => obj),
      );
    } else {
      setData(initialData);
    }
    changePage(0);
  };

  return (
    <Card>
      <CardHeader title="Existing Links" />
      <CardContent>
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <TextField
              fullWidth
              type="text"
              onChange={filterRows}
              defaultValue={defaultShortUrl}
              placeholder="Fuzzy Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <ReactTable
              columns={columns}
              data={data}
              page={page}
              onPageChange={changePage}
              defaultPageSize={5}
              style={{
                fontFamily: 'Roboto',
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LinkTable;
