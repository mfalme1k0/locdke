import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enforceBookingRateLimit } from '../../src/lib/bookingRateLimit'

const fetchMock = vi.fn()

describe('booking rate limit', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test')
    vi.stubEnv('PAYLOAD_SECRET', 'test-secret')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token')
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('allows a request under the limit and sends a hashed identifier', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ result: 1 })))

    await expect(
      enforceBookingRateLimit(new Headers({ 'cf-connecting-ip': '203.0.113.4' })),
    ).resolves.toBeUndefined()

    const [, options] = fetchMock.mock.calls[0]
    const command = JSON.parse(options.body as string)
    expect(command[0]).toBe('EVAL')
    expect(command[3]).toMatch(/^locdke:booking:[a-f0-9]{64}$/)
    expect(command[3]).not.toContain('203.0.113.4')
  })

  it('rejects requests over the limit', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ result: 0 })))

    await expect(enforceBookingRateLimit(new Headers())).rejects.toMatchObject({ status: 429 })
  })

  it('fails closed in production when Redis is not configured', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')

    await expect(enforceBookingRateLimit(new Headers())).rejects.toMatchObject({ status: 503 })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('allows local development without Redis', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')

    await expect(enforceBookingRateLimit(new Headers())).resolves.toBeUndefined()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})