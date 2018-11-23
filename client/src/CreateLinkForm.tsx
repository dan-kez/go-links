import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { addLinkAPI, addOrUpdateLinkAPI } from './apis';

const schema = Yup.object().shape({
  shortUrl: Yup.string()
    .required('Short Url is Required!')
    .matches(/^[^\s]*$/, 'Whitespace is not allowed'),
  destinationUrl: Yup.string()
    .required('Destination Url is Required!')
    .trim()
    .url('Please enter a valid url'),
});

const CreateLinkForm: React.FC<{
  defaultShortUrl?: string;
}> = ({ defaultShortUrl = '' }) => {
  const formik = useFormik({
    initialValues: {
      shortUrl: defaultShortUrl,
      destinationUrl: '',
      allowOverride: false,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: schema,
    onSubmit: async (values, actions) => {
      try {
        let submitResponse;
        if (values.allowOverride) {
          submitResponse = await addOrUpdateLinkAPI(
            values.shortUrl,
            values.destinationUrl,
          );
        } else {
          submitResponse = await addLinkAPI(
            values.shortUrl,
            values.destinationUrl,
          );
        }
        if (submitResponse.status === 409) {
          actions.setErrors({
            shortUrl: 'This url is not available. Please use another.',
          });
        } else {
          actions.setStatus('SUCCESS');
        }
      } catch (_) {
        actions.setStatus('FAILED');
      }
      actions.setSubmitting(false);
    },
  });

  return (
    <Card>
      <CardHeader title="Create a Link" />
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container item direction="column" xs={12} spacing={16}>
            <Grid item>
              <TextField
                fullWidth
                type="text"
                label="Short Url"
                name="shortUrl"
                defaultValue={formik.initialValues.shortUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.errors.shortUrl}
                helperText={formik.errors.shortUrl || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">go/</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="text"
                label="Destination Url"
                name="destinationUrl"
                defaultValue={formik.initialValues.destinationUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!formik.errors.destinationUrl}
                helperText={formik.errors.destinationUrl || ''}
              />
            </Grid>
            <Grid item>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.allowOverride}
                      onChange={formik.handleChange}
                      name="allowOverride"
                    />
                  }
                  label="Allow update of existing url"
                />
              </FormGroup>
            </Grid>
            <Grid item container justify="center">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth={false}
                disabled={formik.isSubmitting}
              >
                Submit
              </Button>
            </Grid>
            {formik.status === 'SUCCESS' && (
              <Grid item>
                <Typography color="primary" variant="h5" align="center">
                  Successfully created link:{' '}
                  <a href={`/${formik.values.shortUrl}`}>
                    {window.location.protocol}
                    {'//'}
                    {window.location.host}/{formik.values.shortUrl}
                  </a>
                </Typography>
              </Grid>
            )}
            {formik.status === 'FAILED' && (
              <Grid item>
                <Typography color="error" variant="h5" align="center">
                  Failed on submit. Please try again.
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLinkForm;
