import {defineQuery} from 'groq'

// Queries are written out in full (no string interpolation) so `sanity typegen` can read them and
// generate result types. Run `npm run typegen` in web/ after changing a query or a schema.
// Story cards share one projection and omit the body, which keeps listing payloads small.

export const homeQuery = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{ eyebrow, heading, intro },
  "featured": *[_type == "story" && defined(slug.current) && defined(publishedDate) && featured == true] | order(publishedDate desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedDate,
    featured,
    tags,
    featuredImage{
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    "authorName": author->name,
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  },
  "stories": *[_type == "story" && defined(slug.current) && defined(publishedDate)] | order(publishedDate desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedDate,
    featured,
    tags,
    featuredImage{
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    "authorName": author->name,
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
}`)

export const storyQuery =
  defineQuery(`*[_type == "story" && defined(slug.current) && defined(publishedDate) && slug.current == $slug][0]{
  _id,
    title,
    "slug": slug.current,
    summary,
    publishedDate,
    featured,
    tags,
    featuredImage{
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    "authorName": author->name,
    "readingTime": round(length(pt::text(body)) / 5 / 200),
  body[]{
    ...,
    _type == "image" => {
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  },
  author->{ name, bio, avatar },
  "related": *[_type == "story" && defined(slug.current) && defined(publishedDate) && slug.current != ^.slug.current] | order(publishedDate desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    summary,
    publishedDate,
    featured,
    tags,
    featuredImage{
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    "authorName": author->name,
    "readingTime": round(length(pt::text(body)) / 5 / 200)
  }
}`)
