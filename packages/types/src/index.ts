export type ID = string
export type ISODate = string

export type Workspace = {
  id: ID
  slug: string
  plan: 'free' | 'pro' | 'business'
  ownerId: ID
  createdAt: ISODate
}

