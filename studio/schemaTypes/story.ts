import { defineArrayMember, defineField, defineType } from 'sanity'
import  BookIcon from '@sanity/icons/Book'
import  StarIcon from '@sanity/icons/Book'

export const story = defineType({
    name: 'story',
    title: 'Story',
    type: 'document',
    icon: BookIcon,
    groups: [
        { name: 'content', title: 'Content', default: true },
        { name: 'meta', title: 'Details' },
    ],
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            group: 'content',
            validation: (rule) => rule.required().max(120),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'meta',
            options: { source: 'title', maxLength: 96 },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'summary',
            title: 'Summary',
            description: 'One or two sentences shown on story cards and in search results.',
            type: 'text',
            rows: 3,
            group: 'content',
            validation: (rule) => rule.required().max(220),
        }),
        defineField({
            name: 'featuredImage',
            title: 'Featured image',
            type: 'image',
            group: 'content',
            options: { hotspot: true },
            fields: [
                defineField({
                    name: 'alt',
                    title: 'Alt text',
                    description: 'Describe the image for screen reader users.',
                    type: 'string',
                    validation: (rule) => rule.required(),
                }),
            ],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
            group: 'meta',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'publishedDate',
            title: 'Published date',
            type: 'date',
            group: 'meta',
            initialValue: () => new Date().toISOString().slice(0, 10),
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'featured',
            title: 'Feature on landing page',
            type: 'boolean',
            group: 'meta',
            initialValue: false,
        }),
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'meta',
            of: [defineArrayMember({ type: 'string' })],
            options: { layout: 'tags' },
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            group: 'content',
            of: [
                defineArrayMember({
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'Heading', value: 'h2' },
                        { title: 'Subheading', value: 'h3' },
                        { title: 'Quote', value: 'blockquote' },
                    ],
                }),
                defineArrayMember({
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        defineField({
                            name: 'alt', title: 'Alt text', type: 'string',
                            validation: (rule) => rule.required()
                        }),
                        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
                    ],
                }),
            ],
            validation: (rule) => rule.required(),
        }),
    ],
    orderings: [
        {
            title: 'Newest first', name: 'publishedDesc', by: [{
                field:
                    'publishedDate', direction: 'desc'
            }]
        },
    ],
    preview: {
        select: {
            title: 'title', author: 'author.name', media: 'featuredImage',
            featured: 'featured'
        },
        prepare: ({ title, author, media, featured }) => ({
            title,
            subtitle: author ? `by ${author}` : 'No author',
            media: featured ? StarIcon : media,
        }),
    },
})