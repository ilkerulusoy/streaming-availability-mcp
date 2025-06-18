import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserContext } from "../types";
import { Env } from "../types";

export function registerStreamingAvailabilityTool(server: McpServer, userContext: UserContext, env: Env) {
  server.tool(
    "streaming_availability",
    "Search for movies and TV shows streaming availability by title and country",
    {
      title: z.string().describe("The title of the movie or TV show to search for"),
      country: z
        .enum([
          "us",
          "tr",
          "uk",
          "de",
          "fr",
          "es",
          "it",
          "ca",
          "au",
          "jp",
          "br",
          "mx",
          "in",
          "kr",
          "nl",
          "se",
          "no",
          "dk",
          "fi",
          "pl",
          "cz",
          "hu",
          "ro",
          "bg",
          "hr",
          "si",
          "sk",
          "lt",
          "lv",
          "ee",
          "gr",
          "pt",
          "ie",
          "at",
          "ch",
          "be",
          "lu",
          "mt",
          "cy",
        ])
        .describe("ISO 3166-1 alpha-2 country code (e.g., 'us', 'tr', 'uk')"),
      show_type: z.enum(["movie", "series", "all"]).optional().describe("Type of content to search for"),
      series_granularity: z.enum(["show", "season", "episode"]).optional().describe("Level of detail for series results"),
      output_language: z
        .enum([
          "en",
          "tr",
          "de",
          "fr",
          "es",
          "it",
          "pt",
          "nl",
          "sv",
          "da",
          "no",
          "fi",
          "pl",
          "cs",
          "hu",
          "sk",
          "sl",
          "hr",
          "bg",
          "ro",
          "el",
          "lt",
          "lv",
          "et",
        ])
        .optional()
        .describe("ISO 639-1 language code for output"),
    },
    async (args) => {
      const { title, country, show_type = "all", series_granularity = "show", output_language = "en" } = args;

      try {
        const results = await searchStreamingAvailability(
          title as string,
          country as string,
          show_type as string,
          series_granularity as string,
          output_language as string,
          userContext,
          env,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  query: {
                    title,
                    country,
                    show_type,
                    series_granularity,
                    output_language,
                  },
                  results: results,
                  total_results: results.length,
                  timestamp: new Date().toISOString(),
                  searched_by: userContext.userId,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  error: "Failed to search streaming availability",
                  message: error instanceof Error ? error.message : "Unknown error",
                  query: { title, country, show_type, series_granularity, output_language },
                  timestamp: new Date().toISOString(),
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}

async function searchStreamingAvailability(
  title: string,
  country: string,
  showType: string,
  seriesGranularity: string,
  outputLanguage: string,
  userContext: UserContext,
  env: Env,
) {
  const baseUrl = "https://streaming-availability.p.rapidapi.com/shows/search/title";

  const params = new URLSearchParams({
    title: title,
    country: country,
    series_granularity: seriesGranularity,
    output_language: outputLanguage,
  });

  if (showType !== "all") {
    params.append("show_type", showType);
  }

  const response = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
      "x-rapidapi-key": env.RAPIDAPI_KEY_STREAMING_AVAILABILITY,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as any[];

  // Transform the response to extract key information
  return data.map((show: any) => ({
    id: show.id,
    title: show.title,
    originalTitle: show.originalTitle,
    showType: show.showType,
    releaseYear: show.releaseYear,
    genres: show.genres?.map((g: any) => g.name) || [],
    directors: show.directors || [],
    cast: show.cast || [],
    rating: show.rating,
    runtime: show.runtime,
    overview: show.overview,
    imdbId: show.imdbId,
    tmdbId: show.tmdbId,
    streamingOptions: extractStreamingOptions(show.streamingOptions, country),
    posterImage: show.imageSet?.verticalPoster?.w480 || null,
    backdropImage: show.imageSet?.horizontalBackdrop?.w720 || null,
  }));
}

function extractStreamingOptions(streamingOptions: any, country: string) {
  if (!streamingOptions || !streamingOptions[country]) {
    return [];
  }
  
  return streamingOptions[country].map((option: any) => ({
    service: {
      id: option.service.id,
      name: option.service.name,
      homePage: option.service.homePage
    },
    type: option.type, // subscription, rent, buy, etc.
    link: option.link,
    videoLink: option.videoLink,
    quality: option.quality,
    availableAudios: option.audios?.map((audio: any) => ({
      language: audio.language,
      region: audio.region
    })) || [],
    availableSubtitles: option.subtitles?.map((sub: any) => ({
      language: sub.language,
      region: sub.region,
      closedCaptions: sub.closedCaptions
    })) || []
  }));
}