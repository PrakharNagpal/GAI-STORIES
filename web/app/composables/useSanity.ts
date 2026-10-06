import {createClient, type SanityClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

type ImageUrlBuilder = ReturnType<typeof imageUrlBuilder>
export type ImageSource = Parameters<ImageUrlBuilder['image']>[0]

let client: SanityClient | undefined
let builder: ImageUrlBuilder | undefined

/** One shared read-only client. Config never changes per request, so a module singleton is safe. */
export function useSanityClient(): SanityClient {
  if (!client) {
    const {sanity} = useRuntimeConfig().public
    if (!sanity.projectId) {
      throw new Error('Missing NUXT_PUBLIC_SANITY_PROJECT_ID')
    }
    client = createClient({
      projectId: sanity.projectId,
      dataset: sanity.dataset,
      apiVersion: sanity.apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  }
  return client
}

/** Image URL builder: urlFor(img).width(800).auto('format').url() */
export function urlFor(source: ImageSource) {
  if (!builder) builder = imageUrlBuilder(useSanityClient())
  return builder.image(source)
}
