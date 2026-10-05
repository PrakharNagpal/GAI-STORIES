import type { PortableTextBlock } from '@portabletext/types'

export interface SanityImage {
    _type?: 'image'
    asset: { _ref: string; _type?: 'reference' }
    alt?: string
    caption?: string
    lqip?: string
    dimensions?: { width: number; height: number; aspectRatio: number }
    hotspot?: { x: number; y: number; height: number; width: number }
    crop?: { top: number; bottom: number; left: number; right: number }
}

export interface Author {
    name: string
    bio?: string
    avatar?: SanityImage
}

export interface StoryCard {
    _id: string
    title: string
    slug: string
    summary: string
    publishedDate: string
    featured: boolean
    tags?: string[]
    featuredImage: SanityImage
    authorName?: string
    readingTime?: number
}

export interface Story extends StoryCard {
    body: PortableTextBlock[]
    author?: Author
    related: StoryCard[]
}

export interface HomeData {
    featured: StoryCard[]
    stories: StoryCard[]
}