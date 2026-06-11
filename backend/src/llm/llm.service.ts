/**
 * Thin client over the local Ollama for auto-generating sentences: checks that the service and model are available and calls the model with enforced structured JSON output; converts errors into user-facing messages.
 */
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OllamaConfig {
  url: string;
  model: string;
  timeoutMs: number;
}

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly config: ConfigService) {}

  private get cfg(): OllamaConfig {
    return this.config.get<OllamaConfig>('ollama')!;
  }

  async assertReady(): Promise<void> {
    const { url, model } = this.cfg;
    let tags: { models?: { name: string }[] };
    try {
      const res = await this.fetchWithTimeout(`${url}/api/tags`, { method: 'GET' }, 5000);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      tags = await res.json();
    } catch (err) {
      this.logger.warn(`Ollama nedostupná na ${url}: ${(err as Error).message}`);
      throw new ServiceUnavailableException(
        `AI generování není dostupné — služba Ollama neběží (${url}). Spusť ji a zkus to znovu.`,
      );
    }

    const available = (tags.models ?? []).map((m) => m.name);
    const hasModel = available.some((n) => n === model || n.startsWith(`${model}:`) || n === `${model}:latest`);
    if (!hasModel) {
      throw new ServiceUnavailableException(
        `Model "${model}" není v Ollamě stažený. Spusť: ollama pull ${model}`,
      );
    }
  }

  async generateJson<T = unknown>(
    prompt: string,
    opts: { system?: string; schema?: Record<string, unknown> } = {},
  ): Promise<T> {
    const { url, model, timeoutMs } = this.cfg;
    let raw: string;
    try {
      const res = await this.fetchWithTimeout(
        `${url}/api/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            prompt,
            system: opts.system,
            stream: false,
            format: opts.schema ?? 'json',
            options: { temperature: 0.3, num_predict: 700, num_ctx: 2048 },
          }),
        },
        timeoutMs,
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const body = (await res.json()) as { response?: string };
      raw = body.response ?? '';
    } catch (err) {
      const msg = (err as Error).name === 'AbortError'
        ? `AI model neodpověděl včas (limit ${Math.round(timeoutMs / 1000)} s). Zkus menší model nebo to zkus znovu.`
        : `Chyba při komunikaci s AI modelem: ${(err as Error).message}`;
      this.logger.warn(msg);
      throw new ServiceUnavailableException(msg);
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      this.logger.warn(`AI model vrátil neplatný JSON: ${raw.slice(0, 200)}`);
      throw new ServiceUnavailableException(
        'AI model vrátil neplatnou odpověď. Zkus generování zopakovat.',
      );
    }
  }

  private async fetchWithTimeout(
    input: string,
    init: RequestInit,
    timeoutMs: number,
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }
}
