import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly validKeys: Record<string, string> = {
        [process.env.CORPUS_API_KEY as string]: 'corpus',
        [process.env.SENTENCE_PROCESSOR_API_KEY as string]: 'sentence_processor',
        [process.env.BACKEND_API_KEY as string]: 'backend',
    };

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey || !this.validKeys[apiKey]) {
            throw new UnauthorizedException('Invalid api key');
        }

        request.namespace = this.validKeys[apiKey];
        return true;
    }
}