import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';


export default async function Index() {
  const session = await auth()
  if (!session) {
    redirect("/auth")
  } else {
    redirect("/dashboard")
  }
  return (
    <div className='min-h-screen w-full flex justify-center items-center'>home page</div>
  );
}
