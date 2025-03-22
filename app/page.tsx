'use client';

import Image from 'next/image';
import React, { Suspense } from 'react';
import spinner from "@/public/spinner.svg";
import Link from 'next/link';


export default function Index() {
  return (
    <Suspense fallback={<div className=" w-full flex justify-center items-center">
      <Image src={spinner} alt="Loading..." width={50} height={50} />
    </div>}>
      <div className="bg-[#282828] pt-10">
        <Link href='sign-in'>
          Sign In
        </Link>

        <Link href='sign-up'>
          Sign Up
        </Link>
      </div>
    </Suspense>
  );
}
