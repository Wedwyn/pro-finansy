import { Request as ExpRequest } from 'express';
import session from 'express-session';

export interface Request extends ExpRequest {
  session: session.Session;
}
