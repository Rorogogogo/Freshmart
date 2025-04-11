export type SubmenuItem = {
  label: string
  href: string
  submenu?: SubmenuItem[]
}

export type HeaderItem = {
  label: string
  href: string
  submenu?: SubmenuItem[]
}
