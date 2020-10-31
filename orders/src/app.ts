import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@oscar-ticketingdev/common';

import { IndexOrderRouter } from '../src/routes/index';
import { DeleteOrderRouter } from '../src/routes/delete';
import { NewOrderRouter } from '../src/routes/new';
import { ShowOrderRouter } from '../src/routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);
app.use(IndexOrderRouter);
app.use(DeleteOrderRouter);
app.use(NewOrderRouter);
app.use(ShowOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
