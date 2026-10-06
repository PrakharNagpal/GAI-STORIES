import type {PortableTextBlock} from '@portabletext/types'
import type {HomeQueryResult, StoryQueryResult} from './sanity.generated'

// Result types come from `npm run typegen` (see utils/queries.ts), so they follow the schema and
// the GROQ projections instead of being maintained by hand.
export type HomeData = HomeQueryResult
export type StoryCard = HomeQueryResult['stories'][number]
// `body` keeps the Portable Text library's own type, which is what <PortableText> expects.
export type Story = Omit<NonNullable<StoryQueryResult>, 'body'> & {body: PortableTextBlock[]}
export type Author = Story['author']
export type SiteSettings = NonNullable<HomeQueryResult['settings']>

// Loose image shape accepted by the image URL builder and <StoryImage>. Generated image types
// mark `asset` optional, which the builder does not accept.
export interface SanityImage {
  _type?: 'image'
  asset?: {_ref: string; _type?: 'reference'}
  alt?: string
  caption?: string
  lqip?: string | null
  dimensions?: {width: number; height: number; aspectRatio: number} | null
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}
