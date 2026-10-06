// Shared projection for story cards. Keeps payloads small: no body text on listing pages.
const cardFields = /* groq */ `
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
`

const published = `_type == "story" && defined(slug.current) && defined(publishedDate)`

export const homeQuery = /* groq */ `{
  "settings": *[_id == "siteSettings"][0]{ eyebrow, heading, intro },
  "featured": *[${published} && featured == true] | order(publishedDate desc)[0...3]{ ${cardFields} },
  "stories": *[${published}] | order(publishedDate desc){ ${cardFields} }
}`

export const storyQuery = /* groq */ `*[${published} && slug.current == $slug][0]{
  ${cardFields},
  body[]{
    ...,
    _type == "image" => {
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    }
  },
  author->{ name, bio, avatar },
  "related": *[${published} && slug.current != ^.slug.current] | order(publishedDate desc)[0...3]{ ${cardFields} }
}`