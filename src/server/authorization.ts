import { verify as jwtVerify, VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { secret } from './constants';

/** Contains static methods relating to authenticating users */
export class Authorization {
  /** Checks that the token given is valid. Used by other middleware in order to get decoded information from the token */
  private static checkToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;
    if (token) {
      jwtVerify(token, secret, (err: VerifyErrors, decoded: any) => { // adding type would break decoded.type
        if (err) {
          return res.json('invalid token');
        } else {
          req.headers.authorization = decoded.type;
          next();
        }
      });
    } else {
      res.status(403).json('403 Forbidden');
    }
  }

  /** A middleware function used to authenticate admins before they are allowed to access endpoints in this file */
  public static admin(req: Request, res: Response, next: NextFunction) {
    Authorization.checkToken(req, res, () => {
      if (req.headers.authorization === 'admin') {
        next();
      } else {
        res.status(403).json('403 Forbidden');
      }
    });
  }

  /** A middleware function used to authenticate users before they are allowed to access endpoints in this file */
  public static user(req: Request, res: Response, next: NextFunction) {
    Authorization.checkToken(req, res, () => {
      if (req.headers.authorization === 'user' || req.headers.authorization === 'admin') {
        next();
      } else {
        res.status(403).json('403 Forbidden');
      }
    });
  }
}
