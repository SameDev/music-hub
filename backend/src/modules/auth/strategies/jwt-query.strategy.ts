import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Only for <audio>/<img> tags, which can't send an Authorization header — the browser
// requests these directly via src=, so the token has to travel in the query string instead.
// Deliberately its own narrow strategy, not a widened extractor on the main 'jwt' strategy,
// so every other endpoint keeps requiring a real header and never accepts a token via query.
function extractFromQuery(req: Request): string | null {
  const token = req.query.token;
  return typeof token === 'string' ? token : null;
}

@Injectable()
export class JwtQueryStrategy extends PassportStrategy(Strategy, 'jwt-query') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: extractFromQuery,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
