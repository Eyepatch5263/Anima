/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
/** The role the character plays in the media */
export type CharacterRole =
  /** A background character in the media */
  | 'BACKGROUND'
  /** A primary character role in the media */
  | 'MAIN'
  /** A supporting character role in the media */
  | 'SUPPORTING';

export type ExternalLinkType =
  | 'INFO'
  | 'SOCIAL'
  | 'STREAMING';

/** The format the media was released in */
export type MediaFormat =
  /** Professionally published manga with more than one chapter */
  | 'MANGA'
  /** Anime movies with a theatrical release */
  | 'MOVIE'
  /** Short anime released as a music video */
  | 'MUSIC'
  /** Written books released as a series of light novels */
  | 'NOVEL'
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  | 'ONA'
  /** Manga with just one chapter */
  | 'ONE_SHOT'
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  | 'OVA'
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  | 'SPECIAL'
  /** Anime broadcast on television */
  | 'TV'
  /** Anime which are under 15 minutes in length and broadcast on television */
  | 'TV_SHORT';

/** Media list watching/reading status enum. */
export type MediaListStatus =
  /** Finished watching/reading */
  | 'COMPLETED'
  /** Currently watching/reading */
  | 'CURRENT'
  /** Stopped watching/reading before completing */
  | 'DROPPED'
  /** Paused watching/reading */
  | 'PAUSED'
  /** Planning to watch/read */
  | 'PLANNING'
  /** Re-watching/reading */
  | 'REPEATING';

/** The type of ranking */
export type MediaRankType =
  /** Ranking is based on the media's popularity */
  | 'POPULAR'
  /** Ranking is based on the media's ratings/score */
  | 'RATED';

/** Type of relation media has to its parent. */
export type MediaRelation =
  /** An adaption of this media into a different format */
  | 'ADAPTATION'
  /** An alternative version of the same media */
  | 'ALTERNATIVE'
  /** Shares at least 1 character */
  | 'CHARACTER'
  /** Version 2 only. */
  | 'COMPILATION'
  /** Version 2 only. */
  | 'CONTAINS'
  /** Other */
  | 'OTHER'
  /** The media a side story is from */
  | 'PARENT'
  /** Released before the relation */
  | 'PREQUEL'
  /** Released after the relation */
  | 'SEQUEL'
  /** A side story of the parent media */
  | 'SIDE_STORY'
  /** Version 2 only. The source material the media was adapted from */
  | 'SOURCE'
  /** An alternative version of the media with a different primary focus */
  | 'SPIN_OFF'
  /** A shortened and summarized version */
  | 'SUMMARY';

export type MediaSeason =
  /** Predominantly started airing between October and November */
  | 'FALL'
  /** Predominantly started airing between April and June */
  | 'SPRING'
  /** Predominantly started airing between July and September */
  | 'SUMMER'
  /** Predominantly started airing between January and March */
  | 'WINTER';

/** Media sort enums */
export type MediaSort =
  | 'CHAPTERS'
  | 'CHAPTERS_DESC'
  | 'DURATION'
  | 'DURATION_DESC'
  | 'END_DATE'
  | 'END_DATE_DESC'
  | 'EPISODES'
  | 'EPISODES_DESC'
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'FORMAT'
  | 'FORMAT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'POPULARITY'
  | 'POPULARITY_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'SEARCH_MATCH'
  | 'START_DATE'
  | 'START_DATE_DESC'
  | 'STATUS'
  | 'STATUS_DESC'
  | 'TITLE_ENGLISH'
  | 'TITLE_ENGLISH_DESC'
  | 'TITLE_NATIVE'
  | 'TITLE_NATIVE_DESC'
  | 'TITLE_ROMAJI'
  | 'TITLE_ROMAJI_DESC'
  | 'TRENDING'
  | 'TRENDING_DESC'
  | 'TYPE'
  | 'TYPE_DESC'
  | 'UPDATED_AT'
  | 'UPDATED_AT_DESC'
  | 'VOLUMES'
  | 'VOLUMES_DESC';

/** Source type the media was adapted from */
export type MediaSource =
  /** Version 2+ only. Japanese Anime */
  | 'ANIME'
  /** Version 3 only. Comics excluding manga */
  | 'COMIC'
  /** Version 2+ only. Self-published works */
  | 'DOUJINSHI'
  /** Version 3 only. Games excluding video games */
  | 'GAME'
  /** Written work published in volumes */
  | 'LIGHT_NOVEL'
  /** Version 3 only. Live action media such as movies or TV show */
  | 'LIVE_ACTION'
  /** Asian comic book */
  | 'MANGA'
  /** Version 3 only. Multimedia project */
  | 'MULTIMEDIA_PROJECT'
  /** Version 2+ only. Written works not published in volumes */
  | 'NOVEL'
  /** An original production not based of another work */
  | 'ORIGINAL'
  /** Other */
  | 'OTHER'
  /** Version 3 only. Picture book */
  | 'PICTURE_BOOK'
  /** Video game */
  | 'VIDEO_GAME'
  /** Video game driven primary by text and narrative */
  | 'VISUAL_NOVEL'
  /** Version 3 only. Written works published online */
  | 'WEB_NOVEL';

/** The current releasing status of the media */
export type MediaStatus =
  /** Ended before the work could be finished */
  | 'CANCELLED'
  /** Has completed and is no longer being released */
  | 'FINISHED'
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  | 'HIATUS'
  /** To be released at a later date */
  | 'NOT_YET_RELEASED'
  /** Currently releasing */
  | 'RELEASING';

/** Media type enum, anime or manga. */
export type MediaType =
  /** Japanese Anime */
  | 'ANIME'
  /** Asian comic */
  | 'MANGA';

/** Recommendation rating enums */
export type RecommendationRating =
  | 'NO_RATING'
  | 'RATE_DOWN'
  | 'RATE_UP';

export type GetGenresAndTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGenresAndTagsQuery = { genres: Array<string | null> | null, tags: Array<{ name: string, description: string | null, category: string | null, isAdult: boolean | null } | null> | null };

export type GetAnimeByGenresQueryVariables = Exact<{
  season?: MediaSeason | null | undefined;
  seasonYear?: number | null | undefined;
  nextSeason?: MediaSeason | null | undefined;
  nextYear?: number | null | undefined;
}>;


export type GetAnimeByGenresQuery = { trending: { media: Array<{ ' $fragmentRefs'?: { 'MediaFragment': MediaFragment } } | null> | null } | null, season: { media: Array<{ ' $fragmentRefs'?: { 'MediaFragment': MediaFragment } } | null> | null } | null, nextSeason: { media: Array<{ ' $fragmentRefs'?: { 'MediaFragment': MediaFragment } } | null> | null } | null, popular: { media: Array<{ ' $fragmentRefs'?: { 'MediaFragment': MediaFragment } } | null> | null } | null, top: { media: Array<{ ' $fragmentRefs'?: { 'MediaFragment': MediaFragment } } | null> | null } | null };

export type MediaFragment = { id: number, bannerImage: string | null, season: MediaSeason | null, seasonYear: number | null, description: string | null, type: MediaType | null, format: MediaFormat | null, status: MediaStatus | null, episodes: number | null, duration: number | null, chapters: number | null, volumes: number | null, genres: Array<string | null> | null, isAdult: boolean | null, averageScore: number | null, popularity: number | null, title: { userPreferred: string | null } | null, coverImage: { extraLarge: string | null, large: string | null, color: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null, endDate: { year: number | null, month: number | null, day: number | null } | null, mediaListEntry: { id: number, status: MediaListStatus | null } | null, nextAiringEpisode: { airingAt: number, timeUntilAiring: number, episode: number } | null, studios: { edges: Array<{ isMain: boolean, node: { id: number, name: string } | null } | null> | null } | null } & { ' $fragmentName'?: 'MediaFragment' };

export type MediaQueryVariables = Exact<{
  id?: number | null | undefined;
  type?: MediaType | null | undefined;
  isAdult?: boolean | null | undefined;
}>;


export type MediaQuery = { Media: { id: number, bannerImage: string | null, description: string | null, season: MediaSeason | null, seasonYear: number | null, type: MediaType | null, format: MediaFormat | null, status: MediaStatus | null, episodes: number | null, duration: number | null, chapters: number | null, volumes: number | null, genres: Array<string | null> | null, synonyms: Array<string | null> | null, source: MediaSource | null, isAdult: boolean | null, isLocked: boolean | null, meanScore: number | null, averageScore: number | null, popularity: number | null, favourites: number | null, isFavouriteBlocked: boolean, hashtag: string | null, countryOfOrigin: unknown, isLicensed: boolean | null, isFavourite: boolean, isRecommendationBlocked: boolean | null, isReviewBlocked: boolean | null, title: { userPreferred: string | null, romaji: string | null, english: string | null, native: string | null } | null, coverImage: { extraLarge: string | null, large: string | null } | null, startDate: { year: number | null, month: number | null, day: number | null } | null, endDate: { year: number | null, month: number | null, day: number | null } | null, nextAiringEpisode: { airingAt: number, timeUntilAiring: number, episode: number } | null, relations: { edges: Array<{ id: number | null, relationType: MediaRelation | null, node: { id: number, format: MediaFormat | null, type: MediaType | null, status: MediaStatus | null, bannerImage: string | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null } | null> | null } | null, characterPreview: { edges: Array<{ id: number | null, role: CharacterRole | null, name: string | null, voiceActors: Array<{ id: number, language: string | null, name: { userPreferred: string | null } | null, image: { large: string | null } | null } | null> | null, node: { id: number, name: { userPreferred: string | null } | null, image: { large: string | null } | null } | null } | null> | null } | null, staffPreview: { edges: Array<{ id: number | null, role: string | null, node: { id: number, language: string | null, name: { userPreferred: string | null } | null, image: { large: string | null } | null } | null } | null> | null } | null, studios: { edges: Array<{ isMain: boolean, node: { id: number, name: string } | null } | null> | null } | null, reviewPreview: { pageInfo: { total: number | null } | null, nodes: Array<{ id: number, summary: string | null, rating: number | null, ratingAmount: number | null, user: { id: number, name: string, avatar: { large: string | null } | null } | null } | null> | null } | null, recommendations: { pageInfo: { total: number | null } | null, nodes: Array<{ id: number, rating: number | null, userRating: RecommendationRating | null, mediaRecommendation: { id: number, format: MediaFormat | null, type: MediaType | null, status: MediaStatus | null, bannerImage: string | null, title: { userPreferred: string | null } | null, coverImage: { large: string | null } | null } | null, user: { id: number, name: string, avatar: { large: string | null } | null } | null } | null> | null } | null, externalLinks: Array<{ id: number, site: string, url: string | null, type: ExternalLinkType | null, language: string | null, color: string | null, icon: string | null, notes: string | null, isDisabled: boolean | null } | null> | null, streamingEpisodes: Array<{ site: string | null, title: string | null, thumbnail: string | null, url: string | null } | null> | null, trailer: { id: string | null, site: string | null } | null, rankings: Array<{ id: number, rank: number, type: MediaRankType, format: MediaFormat, year: number | null, season: MediaSeason | null, allTime: boolean | null, context: string } | null> | null, tags: Array<{ id: number, name: string, description: string | null, rank: number | null, isMediaSpoiler: boolean | null, isGeneralSpoiler: boolean | null, userId: number | null } | null> | null, mediaListEntry: { id: number, status: MediaListStatus | null, score: number | null } | null, stats: { statusDistribution: Array<{ status: MediaListStatus | null, amount: number | null } | null> | null, scoreDistribution: Array<{ score: number | null, amount: number | null } | null> | null } | null } | null };

export type CharactersQueryVariables = Exact<{
  id?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type CharactersQuery = { Media: { id: number, characters: { pageInfo: { total: number | null, perPage: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null } | null, edges: Array<{ id: number | null, role: CharacterRole | null, name: string | null, voiceActorRoles: Array<{ roleNotes: string | null, dubGroup: string | null, voiceActor: { id: number, language: string | null, name: { userPreferred: string | null } | null, image: { large: string | null } | null } | null } | null> | null, node: { id: number, name: { userPreferred: string | null } | null, image: { large: string | null } | null } | null } | null> | null } | null } | null };

export type StaffQueryVariables = Exact<{
  id?: number | null | undefined;
  page?: number | null | undefined;
}>;


export type StaffQuery = { Media: { id: number, staff: { pageInfo: { total: number | null, perPage: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null } | null, edges: Array<{ id: number | null, role: string | null, node: { id: number, name: { userPreferred: string | null } | null, image: { large: string | null } | null } | null } | null> | null } | null } | null };

export type GetTrendsAndRankingsQueryVariables = Exact<{
  id?: number | null | undefined;
}>;


export type GetTrendsAndRankingsQuery = { Media: { id: number, rankings: Array<{ id: number, rank: number, type: MediaRankType, format: MediaFormat, year: number | null, season: MediaSeason | null, allTime: boolean | null, context: string } | null> | null, trends: { nodes: Array<{ averageScore: number | null, date: number, trending: number, popularity: number | null } | null> | null } | null, airingTrends: { nodes: Array<{ averageScore: number | null, inProgress: number | null, episode: number | null } | null> | null } | null, distribution: { status: Array<{ status: MediaListStatus | null, amount: number | null } | null> | null, score: Array<{ score: number | null, amount: number | null } | null> | null } | null } | null };

export type PaginatedAnimeQueryVariables = Exact<{
  page?: number | null | undefined;
  perPage?: number | null | undefined;
  sort?: Array<MediaSort | null | undefined> | MediaSort | null | undefined;
  season?: MediaSeason | null | undefined;
  seasonYear?: number | null | undefined;
  genre?: string | null | undefined;
  format?: MediaFormat | null | undefined;
  status?: MediaStatus | null | undefined;
  search?: string | null | undefined;
}>;


export type PaginatedAnimeQuery = { Page: { pageInfo: { total: number | null, currentPage: number | null, lastPage: number | null, hasNextPage: boolean | null } | null, media: Array<{ ' $fragmentRefs'?: { 'MediaFragment': MediaFragment } } | null> | null } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const MediaFragmentDoc = new TypedDocumentString(`
    fragment media on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    extraLarge
    large
    color
  }
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  bannerImage
  season
  seasonYear
  description
  type
  format
  status(version: 2)
  episodes
  duration
  chapters
  volumes
  genres
  isAdult
  averageScore
  popularity
  mediaListEntry {
    id
    status
  }
  nextAiringEpisode {
    airingAt
    timeUntilAiring
    episode
  }
  studios(isMain: true) {
    edges {
      isMain
      node {
        id
        name
      }
    }
  }
}
    `, {"fragmentName":"media"}) as unknown as TypedDocumentString<MediaFragment, unknown>;
export const GetGenresAndTagsDocument = new TypedDocumentString(`
    query GetGenresAndTags {
  genres: GenreCollection
  tags: MediaTagCollection {
    name
    description
    category
    isAdult
  }
}
    `) as unknown as TypedDocumentString<GetGenresAndTagsQuery, GetGenresAndTagsQueryVariables>;
export const GetAnimeByGenresDocument = new TypedDocumentString(`
    query GetAnimeByGenres($season: MediaSeason, $seasonYear: Int, $nextSeason: MediaSeason, $nextYear: Int) {
  trending: Page(page: 1, perPage: 6) {
    media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
      ...media
    }
  }
  season: Page(page: 1, perPage: 6) {
    media(
      season: $season
      seasonYear: $seasonYear
      sort: POPULARITY_DESC
      type: ANIME
      isAdult: false
    ) {
      ...media
    }
  }
  nextSeason: Page(page: 1, perPage: 6) {
    media(
      season: $nextSeason
      seasonYear: $nextYear
      sort: POPULARITY_DESC
      type: ANIME
      isAdult: false
    ) {
      ...media
    }
  }
  popular: Page(page: 1, perPage: 6) {
    media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
      ...media
    }
  }
  top: Page(page: 1, perPage: 10) {
    media(sort: SCORE_DESC, type: ANIME, isAdult: false) {
      ...media
    }
  }
}
    fragment media on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    extraLarge
    large
    color
  }
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  bannerImage
  season
  seasonYear
  description
  type
  format
  status(version: 2)
  episodes
  duration
  chapters
  volumes
  genres
  isAdult
  averageScore
  popularity
  mediaListEntry {
    id
    status
  }
  nextAiringEpisode {
    airingAt
    timeUntilAiring
    episode
  }
  studios(isMain: true) {
    edges {
      isMain
      node {
        id
        name
      }
    }
  }
}`) as unknown as TypedDocumentString<GetAnimeByGenresQuery, GetAnimeByGenresQueryVariables>;
export const MediaDocument = new TypedDocumentString(`
    query media($id: Int, $type: MediaType, $isAdult: Boolean) {
  Media(id: $id, type: $type, isAdult: $isAdult) {
    id
    title {
      userPreferred
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description
    season
    seasonYear
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    synonyms
    source(version: 3)
    isAdult
    isLocked
    meanScore
    averageScore
    popularity
    favourites
    isFavouriteBlocked
    hashtag
    countryOfOrigin
    isLicensed
    isFavourite
    isRecommendationBlocked
    isFavouriteBlocked
    isReviewBlocked
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    relations {
      edges {
        id
        relationType(version: 2)
        node {
          id
          title {
            userPreferred
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
      }
    }
    characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id
        role
        name
        voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
        node {
          id
          name {
            userPreferred
          }
          image {
            large
          }
        }
      }
    }
    staffPreview: staff(perPage: 8, sort: [RELEVANCE, ID]) {
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
      }
    }
    studios {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
    reviewPreview: reviews(perPage: 2, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        summary
        rating
        ratingAmount
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    recommendations(perPage: 7, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        rating
        userRating
        mediaRecommendation {
          id
          title {
            userPreferred
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    externalLinks {
      id
      site
      url
      type
      language
      color
      icon
      notes
      isDisabled
    }
    streamingEpisodes {
      site
      title
      thumbnail
      url
    }
    trailer {
      id
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    tags {
      id
      name
      description
      rank
      isMediaSpoiler
      isGeneralSpoiler
      userId
    }
    mediaListEntry {
      id
      status
      score
    }
    stats {
      statusDistribution {
        status
        amount
      }
      scoreDistribution {
        score
        amount
      }
    }
  }
}
    `) as unknown as TypedDocumentString<MediaQuery, MediaQueryVariables>;
export const CharactersDocument = new TypedDocumentString(`
    query characters($id: Int, $page: Int) {
  Media(id: $id) {
    id
    characters(page: $page, sort: [ROLE, RELEVANCE, ID]) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      edges {
        id
        role
        name
        voiceActorRoles(sort: [RELEVANCE, ID]) {
          roleNotes
          dubGroup
          voiceActor {
            id
            name {
              userPreferred
            }
            language: languageV2
            image {
              large
            }
          }
        }
        node {
          id
          name {
            userPreferred
          }
          image {
            large
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CharactersQuery, CharactersQueryVariables>;
export const StaffDocument = new TypedDocumentString(`
    query staff($id: Int, $page: Int) {
  Media(id: $id) {
    id
    staff(page: $page, sort: [RELEVANCE, ID]) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
          }
          image {
            large
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<StaffQuery, StaffQueryVariables>;
export const GetTrendsAndRankingsDocument = new TypedDocumentString(`
    query GetTrendsAndRankings($id: Int) {
  Media(id: $id) {
    id
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    trends(sort: ID_DESC) {
      nodes {
        averageScore
        date
        trending
        popularity
      }
    }
    airingTrends: trends(releasing: true, sort: EPISODE_DESC) {
      nodes {
        averageScore
        inProgress
        episode
      }
    }
    distribution: stats {
      status: statusDistribution {
        status
        amount
      }
      score: scoreDistribution {
        score
        amount
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetTrendsAndRankingsQuery, GetTrendsAndRankingsQueryVariables>;
export const PaginatedAnimeDocument = new TypedDocumentString(`
    query PaginatedAnime($page: Int, $perPage: Int, $sort: [MediaSort], $season: MediaSeason, $seasonYear: Int, $genre: String, $format: MediaFormat, $status: MediaStatus, $search: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
    }
    media(
      sort: $sort
      type: ANIME
      isAdult: false
      season: $season
      seasonYear: $seasonYear
      genre: $genre
      format: $format
      status: $status
      search: $search
    ) {
      ...media
    }
  }
}
    fragment media on Media {
  id
  title {
    userPreferred
  }
  coverImage {
    extraLarge
    large
    color
  }
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  bannerImage
  season
  seasonYear
  description
  type
  format
  status(version: 2)
  episodes
  duration
  chapters
  volumes
  genres
  isAdult
  averageScore
  popularity
  mediaListEntry {
    id
    status
  }
  nextAiringEpisode {
    airingAt
    timeUntilAiring
    episode
  }
  studios(isMain: true) {
    edges {
      isMain
      node {
        id
        name
      }
    }
  }
}`) as unknown as TypedDocumentString<PaginatedAnimeQuery, PaginatedAnimeQueryVariables>;