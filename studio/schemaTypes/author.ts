import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {select: {title: 'name', media: 'avatar'}},
})
