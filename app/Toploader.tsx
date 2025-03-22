import NextTopLoader from 'nextjs-toploader'
import React from 'react'

export default function TopLoader() {
  return (
    <>
        <NextTopLoader
            color="#3F3F3F"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            showSpinner={false}
            crawl={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #3F3F3F,0 0 5px #3F3F3F"
        />
    </>
  )
}