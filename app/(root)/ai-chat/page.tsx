import { Assistant } from '@/components/pages/ai-chat/assistant'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
    <div className='h-fit w-full'>
      <Assistant/>
    </div>
  )
}