// Generates seed.ndjson for `sanity dataset import`.
// All stories and people are fictional sample content.
import {writeFileSync} from 'node:fs'
import {randomUUID} from 'node:crypto'

const key = () => randomUUID().replaceAll('-', '').slice(0, 12)

// One Portable Text block. style: 'normal' | 'h2' | 'blockquote'
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{_type: 'span', _key: key(), text, marks: []}],
})

// Sanity's importer downloads any URL given as image@<url> and stores it as an asset.
const image = (picsumId, alt) => ({
  _type: 'image',
  alt,
  _sanityAsset: `image@https://picsum.photos/id/${picsumId}/1600/1000.jpg`,
})

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const authors = [
  {
    _id: 'author-siew-lan',
    name: 'Tan Siew Lan',
    bio: 'Retired schoolteacher in Toa Payoh, learning to paint with her left hand.',
  },
  {
    _id: 'author-arjun',
    name: 'Arjun Menon',
    bio: 'Software tester, son, and reluctant expert on dementia care.',
  },
  {
    _id: 'author-nurul',
    name: 'Nurul Huda',
    bio: 'Accountant and weekend runner based in Tampines.',
  },
  {
    _id: 'author-wei-ming',
    name: 'Lim Wei Ming',
    bio: 'Former ward nurse, now volunteering with a patient support group.',
  },
  {
    _id: 'author-maria',
    name: 'Maria Santos',
    bio: 'Hotel front desk supervisor. Moved from Cebu to Singapore in 2019.',
  },
  {
    _id: 'author-jia-hui',
    name: 'Ong Jia Hui',
    bio: "Third-year university student, usually found studying at her grandparents' flat.",
  },
  {
    _id: 'author-rahul',
    name: 'Rahul Iyer',
    bio: 'Former bank analyst, now running a drinks stall in Jurong West.',
  },
].map((a) => ({_type: 'author', ...a}))

const stories = [
  {
    title: 'Learning to Walk Again at 62',
    author: 'author-siew-lan',
    date: '2026-09-21',
    featured: true,
    img: 1011,
    tags: ['stroke', 'recovery'],
    summary:
      'A stroke took the use of my right side in one afternoon. The way back was slower, and kinder, than I expected.',
    body: [
      block(
        'It happened on a Tuesday while I was hanging laundry. My arm simply stopped listening to me, and then my leg did too.',
      ),
      block('The first weeks', 'h2'),
      block(
        'In the rehabilitation ward, the physiotherapist asked me to stand for ten seconds. I managed four. She wrote it down as if it were a victory, and slowly I began to believe her.',
      ),
      block(
        'Recovery is not a straight line. It is a hundred small days that look the same until you turn around and see how far you have come.',
        'blockquote',
      ),
      block(
        'Today I walk to the market with a stick and stop to rest at the void deck. My neighbours know my route now, and someone always waves.',
      ),
    ],
  },
  {
    title: "What My Mother's Dementia Taught Me About Patience",
    author: 'author-arjun',
    date: '2026-09-10',
    featured: true,
    img: 1027,
    tags: ['dementia', 'caregiving'],
    summary:
      'My mother asks the same question twelve times a day. I am learning to answer it as if it were the first.',
    body: [
      block(
        "Amma was the person who remembered everyone's birthday. Now she sometimes asks me who I am, politely, the way she would greet a guest.",
      ),
      block('Changing how I listen', 'h2'),
      block(
        'A nurse at the memory clinic told me to stop correcting her. Join her where she is, she said. It felt wrong at first, like lying. Then I saw how much calmer Amma became.',
      ),
      block(
        "Caregiving has made my world smaller and, strangely, deeper. I notice the light in the kitchen at four o'clock because that is when she likes her tea.",
      ),
    ],
  },
  {
    title: 'Running Through a Diabetes Diagnosis',
    author: 'author-nurul',
    date: '2026-08-28',
    featured: true,
    img: 1039,
    tags: ['diabetes', 'fitness'],
    summary:
      'At 41 my doctor said the words type 2 diabetes. Two years later I finished my first half marathon.',
    body: [
      block(
        'I left the polyclinic with a pamphlet and a lot of guilt. I thought of every bubble tea and every late supper.',
      ),
      block('Starting small', 'h2'),
      block(
        'My first run lasted three minutes around the HDB block. I walked the rest of the loop and told nobody. The next week it was five minutes.',
      ),
      block(
        'The diagnosis did not make me a runner. It made me pay attention, and paying attention made me a runner.',
        'blockquote',
      ),
      block(
        'My numbers are steadier now. More than that, I have a reason to be outside at six in the morning, when the city still feels like it belongs to everyone.',
      ),
    ],
  },
  {
    title: 'The Night Nurse Who Became the Patient',
    author: 'author-wei-ming',
    date: '2026-08-12',
    featured: false,
    img: 1060,
    tags: ['nursing', 'surgery'],
    summary:
      'For fifteen years I checked on patients at 3 a.m. Then I was the one lying awake, waiting for the footsteps.',
    body: [
      block(
        'I knew every sound of a hospital at night. I did not know how loud those sounds are when you are the one in the bed.',
      ),
      block(
        'After my surgery, a young nurse sat with me for two extra minutes when she saw I could not sleep. She probably does not remember it. I always will.',
      ),
      block(
        'Now when I volunteer, I tell new nurses that those two minutes are part of the treatment.',
      ),
    ],
  },
  {
    title: 'Finding Words Again After Burnout',
    author: 'author-nurul',
    date: '2026-07-30',
    featured: false,
    img: 1043,
    tags: ['mental health', 'work'],
    summary:
      'Burnout did not arrive as a crisis. It arrived as a quiet inability to answer a simple email.',
    body: [
      block(
        'For months I told myself I was just tired. Tired people rest and feel better. I rested and felt nothing.',
      ),
      block('Asking for help', 'h2'),
      block(
        'Saying it out loud to my manager was the hardest sentence I have ever spoken. She listened, and we built a lighter quarter together.',
      ),
      block(
        'I am writing this because someone else is staring at an email right now, unable to begin. You are not lazy. You are carrying too much.',
      ),
    ],
  },
  {
    title: "Cooking for My Father's Heart",
    author: 'author-arjun',
    date: '2026-07-14',
    featured: false,
    img: 1080,
    tags: ['heart health', 'family', 'food'],
    summary:
      'After his bypass surgery, my father missed his favourite dishes more than anything. So we learned to cook them differently.',
    body: [
      block(
        'Appa had strong opinions about food long before he had a cardiologist. Less salt, the doctor said. Appa said nothing, which was worse.',
      ),
      block(
        "We started with his mother's rasam, using more pepper and tamarind and far less salt. He tasted it, frowned, and asked for a second bowl.",
      ),
      block(
        'Food is how my family says the things we do not say out loud. Changing the recipes was a way of saying stay.',
        'blockquote',
      ),
    ],
  },
  {
    title: 'Moving from Cebu with One Suitcase',
    author: 'author-maria',
    date: '2026-09-28',
    featured: true,
    img: 155,
    tags: ['migration', 'work'],
    summary:
      'I arrived at Changi with one suitcase, a job offer and no idea how to order kopi. Seven years later, this is home.',
    body: [
      block(
        'My mother packed the suitcase for me. Half of it was dried mangoes for people I had not met yet.',
      ),
      block('The first year', 'h2'),
      block(
        'I worked night shifts at the hotel and called home every Sunday. I did not tell my family how lonely it was, because they had enough to worry about.',
      ),
      block(
        'Home stopped being one place. Now it is two, and I miss whichever one I am not in.',
        'blockquote',
      ),
      block(
        'Last month I taught a new colleague from Davao how to order kopi siew dai. She laughed at my accent. I laughed too.',
      ),
    ],
  },
  {
    title: 'Learning Teochew to Talk to My Grandfather',
    author: 'author-jia-hui',
    date: '2026-09-15',
    featured: true,
    img: 1067,
    tags: ['family', 'language'],
    summary:
      'For twenty years my grandfather and I smiled at each other across a language gap. At twenty, I decided to close it.',
    body: [
      block(
        'Ah Gong speaks Teochew. I grew up with English and Mandarin. Our conversations were mostly nods and food being pushed towards me.',
      ),
      block(
        "I started with YouTube videos and my aunt's voice notes. My first full sentence to him was about the weather, and it was wrong.",
      ),
      block(
        'He corrected me, slowly, then told me a story about his kampung that nobody in the family had heard before.',
      ),
      block('We are still not fluent with each other. But on Saturdays now, we talk.'),
    ],
  },
  {
    title: 'Leaving Finance to Open a Drinks Stall',
    author: 'author-rahul',
    date: '2026-08-20',
    featured: false,
    img: 1074,
    tags: ['work', 'career change'],
    summary:
      'Everyone said I was throwing away a good career. Some days I agree with them. Most days I do not.',
    body: [
      block(
        "I spent six years building spreadsheets about other people's businesses. At some point I wanted one of my own.",
      ),
      block('What nobody tells you', 'h2'),
      block(
        'The stall opens at 6 a.m. My first week, I burned my hand twice and made less in a day than I used to earn in an hour.',
      ),
      block(
        'But the uncle who orders teh-o kosong every morning now waits for me if I am late. No spreadsheet ever did that.',
      ),
    ],
  },
].map((s) => {
  const slug = slugify(s.title)
  return {
    _id: `story-${slug}`,
    _type: 'story',
    title: s.title,
    slug: {_type: 'slug', current: slug},
    summary: s.summary,
    featuredImage: image(s.img, `Stock photograph chosen to illustrate the story "${s.title}"`),
    author: {_type: 'reference', _ref: s.author},
    publishedDate: s.date,
    featured: s.featured,
    tags: s.tags,
    body: s.body,
  }
})

const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  eyebrow: 'Personal stories from across Asia',
  heading: 'Stories about family, work, health and starting over',
  intro:
    'First-person accounts from people across Asia. Some are about big changes, some about ordinary days.',
}

const lines = [settings, ...authors, ...stories].map((doc) => JSON.stringify(doc)).join('\n')
writeFileSync(new URL('../seed.ndjson', import.meta.url), lines + '\n')
console.log(
  `Wrote site settings, ${authors.length} authors and ${stories.length} stories to seed.ndjson`,
)
