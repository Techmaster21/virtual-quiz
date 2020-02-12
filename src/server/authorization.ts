import { TokenExpiredError, verify as jwtVerify, VerifyErrors } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { secret } from './constants';

/** Contains static methods relating to authenticating users */
export class Authorization {
  /** Checks that the token given is valid. Used by other middleware in order to get decoded information from the token */
  private static checkToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      jwtVerify(token, secret, (err: VerifyErrors, decoded: any) => { // adding type would break decoded.type
        if (err) {
          if (err instanceof TokenExpiredError) {
            return res.status(403).json('Expired token');
          } else {
            return res.status(403).json('Invalid token');
          }
        } else {
          // todo not sure why this worked without the safety check before
          // todo now instead of abusing 'req.header.authorization' (because they added more accurate types),
          //  it abuses set cookie. I hope there are no unintended consequences.
          if (decoded.team) {
            req.headers['set-cookie'] = [decoded.type, decoded.team.schoolName, decoded.team.teamNumber];
          } else {
            req.headers['set-cookie'] = [decoded.type, null, null];
          }
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
      if (req.headers['set-cookie'][0] === 'admin') {
        next();
      } else {
        res.status(403).json('403 Forbidden');
      }
    });
  }

  /** A middleware function used to authenticate users before they are allowed to access endpoints in this file */
  public static user(req: Request, res: Response, next: NextFunction) {
    Authorization.checkToken(req, res, () => {
      if (req.headers['set-cookie'][0] === 'user' || req.headers['set-cookie'][0] === 'admin') {
        next();
      } else {
        res.status(403).json('403 Forbidden');
      }
    });
  }
}
