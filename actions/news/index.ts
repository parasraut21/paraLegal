"use server";

const API_KEY = process.env.NEWSDATA_API_KEY;
const BASE_URL = "https://newsdata.io/api/1/news";

export async function getNews() {
  try {
    // Expanded keywords for more comprehensive legal news coverage
    const keywords = ["law", "legal", "supreme court"].join(" ");

    // Get query parameters
    const country = "in";

    // Construct the API URL with parameters
    const apiUrl = `${BASE_URL}?apikey=${API_KEY}&q=${encodeURIComponent(keywords)}&country=${country}`;
    console.log(apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch news data");
    }

    const data = await response.json();

    // Process each news item to get insights
    const processedResults = await Promise.all(
      data.results.map(async (item:any) => {
        // Extract the basic info
        const newsItem = {
          title: item.title,
          description: item.description,
          link: item.link,
        };

        try {
          // Call the insights API for each news item
          const insightsResponse = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: item.title,
              description: item.description,
            }),
          });

          if (!insightsResponse.ok) {
            throw new Error("Failed to analyze news item");
          }

          const insightsData = await insightsResponse.json();

          // Combine the news item with its insights
          return {
            ...newsItem,
            analysis: insightsData.insights,
          };
        } catch (error) {
          console.error(`Error analyzing news item: ${item.title}`, error);
          // Return the news item without analysis if it fails
          return newsItem;
        }
      })
    );
    console.log(processedResults[0]);

    return processedResults;
  } catch (error) {
    console.error("Error fetching legal news:", error);
    throw new Error("Failed to fetch legal news");
  }
}
