import News from '@/components/pages/learn/News'
import Quiz from '@/components/pages/learn/Quiz'
import React from 'react'

type Props = {}

export default function page({}: Props) {
  return (
    <div className='min-h-[200vh]'>
      <News/>
      {/* <Quiz/> */}
    </div>
  )
}