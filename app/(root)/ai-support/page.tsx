import { getUserProfile } from '@/actions/user'
import { EmotionalSupportAssistant } from '@/components/pages/ai-support/assistant'
import { auth } from '@/lib/auth'
import React from 'react'

type Props = {}

export default async function page({ }: Props) {
  const Session = await auth()
  const user = getUserProfile();
  return (
    <div className='h-fit w-full'>
      <EmotionalSupportAssistant user={user} userName={Session?.user.name || ""} />
    </div>
  )
}