import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (token: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!token) return request.user;
    return request.user[token];
  },
);
