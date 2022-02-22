import * as express from 'express';
import * as api from './api';

export const register = (app: express.Application) => {

  // define a route handler for the default home page
  app.get('/', (req: any, res) => {
    const user = req.userContext ? req.userContext.userinfo : null;
    res.render('index', { user });
  });


  // define a secure route handler for the widgets page
  app.get('/widgets', (req: any, res) => {
    const user = req.userContext ? req.userContext.userinfo : null;
    res.render('widgets', { user });
  });

  api.register(app);
};