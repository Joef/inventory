/* eslint-disable no-console */
import * as express from 'express';
import pgPromise from 'pg-promise';

export const register = (app: express.Application) => {

  const port = parseInt(process.env.PGPORT || '5432', 10);
  const config = {
    database: process.env.PGDATABASE || 'postgres',
    host: process.env.PGHOST || 'localhost',
    port,
    user: process.env.PGUSER || 'postgres'
  };

  const pgp = pgPromise();
  const db = pgp(config);

  app.get('/api/widgets/all', async (req: any, res) => {
    try {

      const widgets = await db.any(`
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM    widgets
                WHERE   user_id = $[userId]
                ORDER BY year, brand, model`, { userId: '1' });

      return res.json(widgets);
    } catch (err) {
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.get('/api/widgets/total', async (req: any, res) => {
    try {

      const total = await db.one(`
            SELECT  count(*) AS total
            FROM    widgets
            WHERE   user_id = $[userId]`, { userId: '1' }, (data: { total: number }) => {
        return {
          total: +data.total
        };
      });
      return res.json(total);
    } catch (err) {
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.get('/api/widgets/find/:search', async (req: any, res) => {
    try {

      const widgets = await db.any(`
                SELECT
                    id
                    , brand
                    , model
                    , year
                    , color
                FROM    widgets
                WHERE   user_id = $[userId]
                AND   ( brand ILIKE $[search] OR model ILIKE $[search] )`,
        { userId: '1', search: `%${req.params.search}%` });
      return res.json(widgets);
    } catch (err) {
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.post('/api/widgets/add', async (req: any, res) => {
    try {

      const id = await db.one(`
                INSERT INTO widgets( user_id, brand, model, year, color )
                VALUES( $[userId], $[brand], $[model], $[year], $[color] )
                RETURNING id;`,
        { userId: '1', ...req.body });
      return res.json({ id });
    } catch (err) {
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.post('/api/widgets/update', async (req: any, res) => {
    try {

      const id = await db.one(`
                UPDATE widgets
                SET brand = $[brand]
                    , model = $[model]
                    , year = $[year]
                    , color = $[color]
                WHERE
                    id = $[id]
                    AND user_id = $[userId]
                RETURNING
                    id;`,
        { userId: '1', ...req.body });
      return res.json({ id });
    } catch (err) {
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.delete('/api/widgets/remove/:id', async (req: any, res) => {
    try {

      const id = await db.result(`
                DELETE
                FROM    widgets
                WHERE   user_id = $[userId]
                AND     id = $[id]`,
        { userId: '1', id: req.params.id }, (r) => r.rowCount);
      return res.json({ id });
    } catch (err) {
      console.error(err);
      res.json({ error: err.message || err });
    }
  });
};