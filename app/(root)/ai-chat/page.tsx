import { getUserProfile } from '@/actions/user'
import { Assistant } from '@/components/pages/ai-chat/assistant'
import { auth } from '@/lib/auth'
import React from 'react'

type Props = {}

export default async function page({}: Props) {
  const Session = await auth()
  const user = getUserProfile();
  return (
    <div className='h-fit w-full'>
      <Assistant user={user} userName={Session?.user.name || ""}/>
    </div>
  )
}