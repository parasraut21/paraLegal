// components/PHProvider.tsx
'use client'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
// import { RageClickDetector } from '@/components/RageClickDetector'

export function PHProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        autocapture: false
      })

    }

  }, [])

  return (
    <PostHogProvider client={posthog}>
      {/* <RageClickDetector /> */}
      {children}
    </PostHogProvider>
  )
}