export enum SystemEntities {
  ROLE = 'role',
  USER = 'user'
}

interface EntityMap {
  key: SystemEntities,
  label: string,
  url: string
}

export const entitiesMap: EntityMap[] = [
  { key: SystemEntities.ROLE, label: 'cargo', url: '/role' }
]
