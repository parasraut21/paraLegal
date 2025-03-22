import { EmotionalSupportAssistant } from '@/components/pages/ai-support/assistant'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
  return (
    <div className='h-fit w-full'>
      <EmotionalSupportAssistant />
    </div>
  )
}