"use client"
import useGetNews from '@/hooks/tanstack/getNews'
import React from 'react'

export default function News() {
    const { data, isLoading, isError } = useGetNews()

    if (isLoading) {
        return <div className="p-4 text-center">Loading news articles...</div>
    }

    if (isError) {
        return <div className="p-4 text-center text-red-500">Error loading news. Please try again later.</div>
    }

    if (!data || data.length === 0) {
        return <div className="p-4 text-center">No news articles found.</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Legal News</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((newsItem, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden shadow-md">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-2">{newsItem.title}</h2>
                            <p className="text-gray-600 mb-3">{newsItem.description}</p>
                            <a
                                href={newsItem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline mb-4 inline-block"
                            >
                                Read full article
                            </a>

                            {newsItem.analysis && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className={`text-sm font-medium px-2 py-1 rounded-full inline-block mb-2 ${newsItem.analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                                            newsItem.analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {newsItem.analysis.sentiment.charAt(0).toUpperCase() + newsItem.analysis.sentiment.slice(1)}
                                    </div>

                                    <div className="mb-2">
                                        <h3 className="text-sm font-semibold text-gray-700">Impact</h3>
                                        <p className="text-sm text-gray-600">{newsItem.analysis.impact}</p>
                                    </div>

                                    <div className="mb-2">
                                        <h3 className="text-sm font-semibold text-gray-700">Insights</h3>
                                        <p className="text-sm text-gray-600">{newsItem.analysis.insights}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">Suggestions</h3>
                                        <p className="text-sm text-gray-600">{newsItem.analysis.suggestions}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}