import type { Response } from 'express';
import { z } from 'zod';
import { getProfile, syncOnboarding } from '../services/onboardingService.js';
import { SECTIONS } from '../domain/questionSchema.js';
import type { AuthedRequest } from '../middleware/index.js';

/**
 * Envelope validation only — the SHAPE of the payload. Whether each answer is
 * a legal value for its question is decided by the question schema inside
 * `syncOnboarding`, because that is where the enum lives.
 */
export const syncSchema = z.object({
  locale: z.string().min(2).max(10).default('en'),
  responses: z
    .array(
      z.object({
        questionId: z.string().min(1).max(64),
        section: z.enum(SECTIONS),
        type: z.enum(['single', 'multiple', 'measure']),
        value: z.array(z.string().max(64)).min(1).max(16),
        canonicalUnit: z.string().max(16).nullish(),
      }),
    )
    // Bounded so a client cannot post an unbounded batch.
    .min(1)
    .max(60),
});

export async function putOnboarding(req: AuthedRequest, res: Response) {
  const { locale, responses } = syncSchema.parse(req.body);
  const result = await syncOnboarding(req.userId!, responses, locale);
  // 200 even with partial rejections: the accepted answers were stored, and
  // the client is told exactly which were not. Failing the whole batch would
  // lose good answers because of one bad one.
  res.status(200).json(result);
}

export async function getOnboardingProfile(req: AuthedRequest, res: Response) {
  const profile = await getProfile(req.userId!);
  res.status(200).json({ profile });
}
