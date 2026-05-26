import { useQuery } from '@tanstack/react-query'
import { graphql } from '@/src/graphql'
import { execute } from '@/src/graphql/execute'
import {
    GetMangaByGenresAndTagsQueryVariables,
    GetMangaCharactersQueryVariables,
    GetMangaStaffQueryVariables,
    GetMangaStatisticsQueryVariables,
    MediaType
} from '../graphql/graphql'

const GetGenres = graphql(`
    query GetGenres {
    genres: GenreCollection
    tags: MediaTagCollection {
        name
        description
        category
        isAdult
    }
    }`)

export const GetGenresQuery = () => {
    const { data } = useQuery({
        queryKey: ['genres'],
        queryFn: () => execute(GetGenres)
    })
    return data
}

const GetMangaByGenresAndTags = graphql(`
    query GetMangaByGenresAndTags(
    $page: Int = 1
    $id: Int
    $type: MediaType
    $isAdult: Boolean = false
    $search: String
    $format: [MediaFormat]
    $status: MediaStatus
    $countryOfOrigin: CountryCode
    $source: MediaSource
    $season: MediaSeason
    $seasonYear: Int
    $year: String
    $onList: Boolean
    $yearLesser: FuzzyDateInt
    $yearGreater: FuzzyDateInt
    $episodeLesser: Int
    $episodeGreater: Int
    $durationLesser: Int
    $durationGreater: Int
    $chapterLesser: Int
    $chapterGreater: Int
    $volumeLesser: Int
    $volumeGreater: Int
    $licensedBy: [Int]
    $isLicensed: Boolean
    $genres: [String]
    $excludedGenres: [String]
    $tags: [String]
    $excludedTags: [String]
    $minimumTagRank: Int
    $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
    ) {
    Page(page: $page, perPage: 20) {
        pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
        }
        media(
        id: $id
        type: $type
        season: $season
        format_in: $format
        status: $status
        countryOfOrigin: $countryOfOrigin
        source: $source
        search: $search
        onList: $onList
        seasonYear: $seasonYear
        startDate_like: $year
        startDate_lesser: $yearLesser
        startDate_greater: $yearGreater
        episodes_lesser: $episodeLesser
        episodes_greater: $episodeGreater
        duration_lesser: $durationLesser
        duration_greater: $durationGreater
        chapters_lesser: $chapterLesser
        chapters_greater: $chapterGreater
        volumes_lesser: $volumeLesser
        volumes_greater: $volumeGreater
        licensedById_in: $licensedBy
        isLicensed: $isLicensed
        genre_in: $genres
        genre_not_in: $excludedGenres
        tag_in: $tags
        tag_not_in: $excludedTags
        minimumTagRank: $minimumTagRank
        sort: $sort
        isAdult: $isAdult
        ) {
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
        nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
        }
        mediaListEntry {
            id
            status
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
    }
    }`)

export const GetMangaByGenresAndTagsQuery = (variables: GetMangaByGenresAndTagsQueryVariables) => {
    const { data } = useQuery({
        queryKey: ['manga-by-genres-tags', variables],
        queryFn: () => execute(GetMangaByGenresAndTags, variables)
    })
    return data
}

// query media($id:Int,$type:MediaType,$isAdult:Boolean){Media(id:$id,type:$type,isAdult:$isAdult){id title{userPreferred romaji english native}coverImage{extraLarge large}bannerImage startDate{year month day}endDate{year month day}description season seasonYear type format status(version:2)episodes duration chapters volumes genres synonyms source(version:3)isAdult isLocked meanScore averageScore popularity favourites isFavouriteBlocked hashtag countryOfOrigin isLicensed isFavourite isRecommendationBlocked isFavouriteBlocked isReviewBlocked nextAiringEpisode{airingAt timeUntilAiring episode}relations{edges{id relationType(version:2)node{id title{userPreferred}format type status(version:2)bannerImage coverImage{large}}}}characterPreview:characters(perPage:6,sort:[ROLE,RELEVANCE,ID]){edges{id role name voiceActors(language:JAPANESE,sort:[RELEVANCE,ID]){id name{userPreferred}language:languageV2 image{large}}node{id name{userPreferred}image{large}}}}staffPreview:staff(perPage:8,sort:[RELEVANCE,ID]){edges{id role node{id name{userPreferred}language:languageV2 image{large}}}}studios{edges{isMain node{id name}}}reviewPreview:reviews(perPage:2,sort:[RATING_DESC,ID]){pageInfo{total}nodes{id summary rating ratingAmount user{id name avatar{large}}}}recommendations(perPage:7,sort:[RATING_DESC,ID]){pageInfo{total}nodes{id rating userRating mediaRecommendation{id title{userPreferred}format type status(version:2)bannerImage coverImage{large}}user{id name avatar{large}}}}externalLinks{id site url type language color icon notes isDisabled}streamingEpisodes{site title thumbnail url}trailer{id site}rankings{id rank type format year season allTime context}tags{id name description rank isMediaSpoiler isGeneralSpoiler userId}mediaListEntry{id status score}stats{statusDistribution{status amount}scoreDistribution{score amount}}}}
const GetMangaByIdQuery  = graphql(`
    query media($id:Int,$type:MediaType,$isAdult:Boolean){Media(id:$id,type:$type,isAdult:$isAdult){
        id title{userPreferred romaji english native}
        coverImage{extraLarge large}
        bannerImage 
        startDate{year month day}
        endDate{year month day}
        description 
        season seasonYear 
        type format 
        status(version:2)
        episodes 
        duration 
        chapters 
        volumes 
        genres 
        synonyms 
        source(version:3)
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
        nextAiringEpisode{airingAt timeUntilAiring episode}
        relations{edges{id relationType(version:2)node{id title{userPreferred}format type status(version:2)bannerImage coverImage{large}}}}
        characterPreview:characters(perPage:6,sort:[ROLE,RELEVANCE,ID]){edges{id role name voiceActors(language:JAPANESE,sort:[RELEVANCE,ID]){id name{userPreferred}language:languageV2 image{large}}node{id name{userPreferred}image{large}}}}
        staffPreview:staff(perPage:8,sort:[RELEVANCE,ID]){edges{id role node{id name{userPreferred}language:languageV2 image{large}}}}
        studios{edges{isMain node{id name}}}
        reviewPreview:reviews(perPage:2,sort:[RATING_DESC,ID]){pageInfo{total}nodes{id summary rating ratingAmount user{id name avatar{large}}}}
        recommendations(perPage:7,sort:[RATING_DESC,ID]){pageInfo{total}nodes{id rating userRating mediaRecommendation{id title{userPreferred}format type status(version:2)bannerImage coverImage{large}}user{id name avatar{large}}}}
        externalLinks{id site url type language color icon notes isDisabled}
        streamingEpisodes{site title thumbnail url}
        trailer{id site}
        rankings{id rank type format year season allTime context}
        tags{id name description rank isMediaSpoiler isGeneralSpoiler userId}
        mediaListEntry{id status score}
        stats{statusDistribution{status amount}scoreDistribution{score amount}}}
    }
    `)

export const GetMangaById = (variables: {id:number,type:MediaType,isAdult:boolean}) => {
    const { data } = useQuery({
        queryKey: ['manga-by-id', variables],
        queryFn: () => execute(GetMangaByIdQuery, variables)
    })
    return data
}

const GetMangaCharactersQuery = graphql(`
    query GetMangaCharacters($id: Int, $page: Int) {
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
    }`)

export const GetMangaCharacters = (variables: GetMangaCharactersQueryVariables) => {
    const { data } = useQuery({
        queryKey: ['manga-characters', variables],
        queryFn: () => execute(GetMangaCharactersQuery, variables)
    })
    return data
}

const GetMangaStaffQuery = graphql(`
    query GetMangaStaff($id: Int, $page: Int) {
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
    }`)

export const GetMangaStaff = (variables: GetMangaStaffQueryVariables) => {
    const { data } = useQuery({
        queryKey: ['manga-staff', variables],
        queryFn: () => execute(GetMangaStaffQuery, variables)
    })
    return data
}



const GetMangaStatisticsQuery = graphql(`
    query GetMangaStatistics($id: Int) {
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
    }`)

export const GetMangaStatistics = (variables: GetMangaStatisticsQueryVariables) => {
    const { data } = useQuery({
        queryKey: ['manga-statistics', variables],
        queryFn: () => execute(GetMangaStatisticsQuery, variables)
    })
    return data
}

export const prefetchMangaDetails = (queryClient: any, id: number) => {
  const p1 = queryClient.prefetchQuery({
    queryKey: ['manga-by-id', { id, type: 'MANGA' as MediaType, isAdult: false }],
    queryFn: () => execute(GetMangaByIdQuery, { id, type: 'MANGA' as MediaType, isAdult: false }),
    staleTime: 5 * 60 * 1000,
  })
  const p2 = queryClient.prefetchQuery({
    queryKey: ['manga-characters', { id, page: 1 }],
    queryFn: () => execute(GetMangaCharactersQuery, { id, page: 1 }),
    staleTime: 5 * 60 * 1000,
  })
  const p3 = queryClient.prefetchQuery({
    queryKey: ['manga-staff', { id, page: 1 }],
    queryFn: () => execute(GetMangaStaffQuery, { id, page: 1 }),
    staleTime: 5 * 60 * 1000,
  })
  const p4 = queryClient.prefetchQuery({
    queryKey: ['manga-statistics', { id }],
    queryFn: () => execute(GetMangaStatisticsQuery, { id }),
    staleTime: 5 * 60 * 1000,
  })
  return Promise.all([p1, p2, p3, p4])
}