import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Homepage eyebrow',
      description: 'Short label above the homepage heading.',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'heading',
      title: 'Homepage heading',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'intro',
      title: 'Homepage intro',
      description: 'One or two sentences describing the site. Also used as the homepage meta description. Do not mention specific stories.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
