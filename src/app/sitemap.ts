import { MetadataRoute } from 'next'

const BASE_URL = 'https://8tools.org'

const toolSlugs = [
  'disability-employment',
  'cbm-calculator',
  'overtime-36',
  'concrete-volume',
  '106wall',
  'utilization-rate',
  'man-day',
  'recruitment-cost',
  'shift-labor-cost',
  'building-area',
  'depreciation',
  'furusato-tax',
  'date-calculator',
  'time-calculator',
  'take-home-pay',
  'percent-calc',
  'age-calculator',
  'discount-calc',
  'compound-interest',
  'interest-rate',
  'tax-calc',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date('2026-04-09'),
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2026-04-09'),
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date('2026-04-09'),
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date('2026-04-09'),
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date('2026-04-09'),
    },
  ]

  const toolPages: MetadataRoute.Sitemap = toolSlugs.map((slug) => ({
    url: `${BASE_URL}/tools/${slug}`,
    lastModified: new Date('2026-04-09'),
  }))

  return [...staticPages, ...toolPages]
}
