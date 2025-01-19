// Import required libraries
import axios from 'axios';
import * as cheerio from 'cheerio';
import {OpenAI} from 'openai';

// import natural from 'natural'

// Stopwords list (can be loaded dynamically if needed)
const stopwords = new Set([
    'the', 'is', 'in', 'and', 'to', 'a', 'of', 'it', 'that', 'on', 'for', 'with', 'as',
    'was', 'at', 'by', 'an', 'be', 'this', 'which', 'or', 'from', 'are', 'but', 'not',
    'have', 'has', 'you', 'they', 'we', 'can', 'their', 'its', 'if', 'will', 'so', 'do'
]);

// Fetch website content with improved error handling
export async function fetchWebsiteContent(url) {
    try {
        const response = await axios.get(url, { timeout: 10000 }); // 10-second timeout
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Axios error fetching the URL: ${error.message}`);
        } else {
            console.error(`Unexpected error: ${error}`);
        }
        return null;
    }
}

// Extract text from HTML, handling edge cases
export function extractTextFromHtml(html) {
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style, noscript').remove();

    // Extract and clean text content
    const text = $('body').text()
        .replace(/[^a-zA-Z\s]/g, '') 
        .replace(/\s+/g, ' ')
        .trim();

    if (!text) {
        console.warn('Warning: Extracted text is empty. Check the structure of the page.');
    }

    console.log("\n\n\n\n\n\n\nTESTING SCRAPED TEXT IN WEBSCRAPER", text)
    return text;
}





//Katie testing implementaiton ------------------------------------------------------------------------------------------------
const keywordBank = [
    'Data',
    'Measurement',
    'Analysis',
    'Probability',
    'Inference',
    'Population',
    'Sample',
    'Mean',
    'Median',
    'Mode',
    'Standard deviation',
    'Variance',
    'Percentile',
    'Correlation',
    'Regression',
    'Hypothesis testing',
    'Confidence interval',
    'P-value',
    'Significance level',
    'Chi-square test',
    'T-test',
    'ANOVA',
    'Frequency distribution',
    'Histogram',
    'Box plot',
    'Scatter plot',
    'Normal distribution',
    'Standard error',
    'Sampling distribution',
    'Non-parametric test',
    'Bayesian statistics',
    'Descriptive statistics',
    'Inferential statistics',
    'Exploratory data analysis',
    'Confirmatory data analysis',
    'Multivariate analysis',
    'Time series analysis',
    'Survival analysis',
    'Predictive modeling',
    'Resampling methods',
    'Cross-validation',
    'Bootstrapping',
    'Permutation test',
    'Data mining',
    'Big data',
    'Machine learning',
    'Deep learning',
    'Data visualization',
    'Data interpretation',
    'Data-driven decisions.'
  ]

const askForSimilarity = async (text1, listofString) => {

    //openAI api key auth
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: "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",
    })

    const combineKeywords = listofString.join(" ")
    console.log( " \n\n\n\n\n\n\n\n\n\nHERE IS THE COMBINE", combineKeywords)

    const completion = await openai.chat.completions.create({
        model: "openchat/openchat-7b:free",
        messages: [
          {
            "role": "user",
            "content": `${combineKeywords} compared with ${text1} how related are these two texts, return 1 for related, 0 for unrelated topics`,
          }
        ]
      })

    console.log(completion.choices[0].message)

    // const distance = natural.JaroWinklerDistance(text1, combineKeywords);
    // return distance
}

export async function processUrl(url) {
    console.log(`Fetching content from: ${url}`);

    const htmlContent = await fetchWebsiteContent(url);
    if (!htmlContent) {
        console.error('Failed to fetch website content.');
        return;
    }

    const text = extractTextFromHtml(htmlContent);
    if (!text) {
        console.error('No text content could be extracted from the HTML.');
        return;
    }

    const keywords = extractKeywords(text);
    const combinedKeywords = keywords.map((item) => item[0]).join(' ')
    console.log("\n\n\n\n\nHERE IS THE COMBINED KEYWORDS FROM EXTRACTED", combinedKeywords);


    askForSimilarity(combinedKeywords, keywordBank)
    // console.log(distanceSim)

}








//END -------------------------------------------------------------------------------------------------------------------------

// Extract keywords with enhancements
export function extractKeywords(text, numKeywords = 10) {
    const words = text
        .toLowerCase()
        .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphanumeric characters
        .split(/\s+/);

    // Filter out stopwords and short words
    const filteredWords = words.filter(word => word.length > 2 && !stopwords.has(word));

    if (filteredWords.length === 0) {
        console.warn('Warning: No significant keywords found in the text.');
    }

    // Count word frequencies
    const wordCounts = {};
    for (const word of filteredWords) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    }

    // Sort by frequency and return the top keywords
    return Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, numKeywords);
}

// Main function that processes a given URL directly
// export async function processUrl(url) {
//     console.log(`Fetching content from: ${url}`);

//     const htmlContent = await fetchWebsiteContent(url);
//     if (!htmlContent) {
//         console.error('Failed to fetch website content.');
//         return;
//     }

//     const text = extractTextFromHtml(htmlContent);
//     if (!text) {
//         console.error('No text content could be extracted from the HTML.');
//         return;
//     }

//     const keywords = extractKeywords(text);

//     return keywords;

// }
