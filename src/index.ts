import { serve } from '@hono/node-server'
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';

import getInfo from './getinfo';
import trade from './trade/trade';
import transHistory from './history';
import tradeHistory from './trade/history';

const app = new Hono()
const basePort = 5500;

app.onError((err, c) => {
  if (err instanceof HTTPException) {
      return c.json(
          { success: false, message: err.message || 'error' },
          { status: err.status },
      );
  } else {
      console.error(err.cause);
  }
  return c.json(
      { success: false, message: err.message || 'internal server error' },
      { status: 500 },
  );
});

app.notFound((c) => {
  return c.json(
      { success: false, message: 'Route not found' },
      { status: 404 },
  );
})
  .use(logger())
  .route('/api', getInfo)
  .route('/api', trade)
  .route('/api', transHistory)
  .route('/api', tradeHistory);

console.log(`Server is running on port http://localhost:${basePort}`)

serve({
  fetch: app.fetch,
  port: basePort,
})
