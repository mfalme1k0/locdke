import { createHmac, randomUUID } from 'node:crypto'
import { APIError } from 'payload'

const requestLimit = 5
const windowMilliseconds = 15 * 60 * 1000

const slidingWindowScript = `
local cutoff = tonumber(ARGV[1]) - tonumber(ARGV[2])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', cutoff)
local count = redis.call('ZCARD', KEYS[1])
if count >= tonumber(ARGV[3]) then
  return 0
end
redis.call('ZADD', KEYS[1], ARGV[1], ARGV[4])
redis.call('EXPIRE', KEYS[1], math.ceil(tonumber(ARGV[2]) / 1000))
return 1
`

export async function enforceBookingRateLimit(headers: Headers): Promise<void> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    if (process.env.NODE_ENV !== 'production') return
    throw new APIError('Booking submissions are temporarily unavailable', 503)
  }

  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new APIError('Booking submissions are temporarily unavailable', 503)

  const address =
    headers.get('cf-connecting-ip') ??
    headers.get('x-nf-client-connection-ip') ??
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  const identifier = createHmac('sha256', secret).update(address).digest('hex')

  try {
    const response = await fetch(redisUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        'EVAL',
        slidingWindowScript,
        '1',
        `locdke:booking:${identifier}`,
        String(Date.now()),
        String(windowMilliseconds),
        String(requestLimit),
        randomUUID(),
      ]),
    })

    const result: { result?: unknown; error?: string } = await response.json()
    if (!response.ok || result.error || (result.result !== 0 && result.result !== 1)) {
      throw new Error('Rate-limit service returned an invalid response')
    }

    if (result.result === 0) throw new APIError('Too many booking requests', 429)
  } catch (error) {
    if (error instanceof APIError) throw error
    throw new APIError('Booking submissions are temporarily unavailable', 503)
  }
}