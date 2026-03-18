import { LogOut, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'
import type { SideBarLink } from '@/components/navigation/sidebar-config'
import GlassContainer from '../liquidGlass/GlassContainer'

type SideBarProps = {
  links: SideBarLink[]
  name?: string
  roleLabel?: string
  avatarLabel?: string
}

type ActiveLinkProps = {
  item: SideBarLink
  isActive: boolean
  className: string
  iconClassName: string
  labelClassName?: string
  onClick?: () => void
}

const getIsActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

function ActiveLink({
  item,
  isActive,
  className,
  iconClassName,
  labelClassName,
  onClick,
}: ActiveLinkProps) {
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={`${className} ${isActive ? 'bg-white/12 text-white' : ''}`}
      activeProps={{
        className: 'bg-white/12 text-white',
      }}
    >
      <Icon className={iconClassName} strokeWidth={1.8} />
      <span className={labelClassName}>{item.title}</span>
    </Link>
  )
}

function ProfileCard({
  avatarLabel,
  name,
  roleLabel,
}: Pick<SideBarProps, 'avatarLabel' | 'name' | 'roleLabel'>) {
  return (
    <div className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-sky-300/85 text-lg font-semibold text-slate-950">
          {avatarLabel}
        </div>
        <div className="min-w-0">
          <p className="truncate text-md font-semibold leading-none">{name}</p>
          <p className="mt-1 text-sm text-white/58">{roleLabel}</p>
        </div>
      </div>
    </div>
  )
}

function DesktopSideBar({
  links,
  pathname,
  avatarLabel,
  name,
  roleLabel,
  onLogout,
}: {
  links: SideBarLink[]
  pathname: string
  avatarLabel: string
  name: string
  roleLabel: string
  onLogout: () => void
}) {
  return (
    <div className="fixed inset-y-0 left-0 z-40 hidden w-76 p-6 md:block">
      <GlassContainer className="h-full overflow-hidden border-r border-white/12 md:border">
        <aside className="flex h-full flex-col p-5 text-white">
          <ProfileCard
            avatarLabel={avatarLabel}
            name={name}
            roleLabel={roleLabel}
          />

          <div className="my-5 h-px bg-white/14" />

          <nav className="flex-1">
            <ul className="space-y-2">
              {links.map((item) => (
                <li key={item.href}>
                  <ActiveLink
                    item={item}
                    isActive={getIsActive(pathname, item.href)}
                    className="flex items-center gap-4 rounded-[14px] px-4 py-3 text-lg text-white/82 transition hover:bg-white/8 hover:text-white"
                    iconClassName="h-6 w-6 shrink-0"
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 h-px bg-white/14" />

          <button
            type="button"
            onClick={onLogout}
            className="mt-4 flex items-center gap-4 rounded-[14px] px-4 py-3 text-left text-lg text-white/82 transition hover:cursor-pointer hover:bg-white/8 hover:text-white"
          >
            <LogOut className="h-6 w-6 shrink-0" strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </aside>
      </GlassContainer>
    </div>
  )
}

function MobileSideBar({
  dashboardLink,
  menuLinks,
  onLogout,
  pathname,
  profileLink,
}: {
  dashboardLink?: SideBarLink
  menuLinks: SideBarLink[]
  onLogout: () => void
  pathname: string
  profileLink?: SideBarLink
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <div className="relative">
        {isOpen ? (
          <GlassContainer className="absolute bottom-[calc(100%+0.75rem)] left-0 w-56 overflow-hidden border border-white/12">
            <div className="p-2 text-white">
              {menuLinks.map((item) => (
                <ActiveLink
                  key={item.href}
                  item={item}
                  isActive={getIsActive(pathname, item.href)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-[14px] px-3 py-3 text-sm text-white/78 transition hover:bg-white/8 hover:text-white"
                  iconClassName="h-4 w-4 shrink-0"
                />
              ))}

              <button
                type="button"
                onClick={onLogout}
                className="mt-1 flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left text-sm text-white/78 transition hover:cursor-pointer hover:bg-white/8 hover:text-white"
              >
                <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <span>Logout</span>
              </button>
            </div>
          </GlassContainer>
        ) : null}

        <GlassContainer className="overflow-hidden border border-white/12">
          <aside className="grid grid-cols-3 items-center px-2 py-2 text-white">
            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className="flex min-h-16 flex-col items-center justify-center rounded-[14px] text-[11px] text-white/78 transition hover:cursor-pointer hover:bg-white/8 hover:text-white"
            >
              {isOpen ? (
                <X className="h-5 w-5 shrink-0" strokeWidth={1.8} />
              ) : (
                <Plus className="h-5 w-5 shrink-0" strokeWidth={1.8} />
              )}
              <span className="mt-1 whitespace-nowrap">Menu</span>
            </button>

            {dashboardLink ? (
              <ActiveLink
                item={dashboardLink}
                isActive={getIsActive(pathname, dashboardLink.href)}
                className="flex min-h-16 flex-col items-center justify-center rounded-[14px] px-3 py-2 text-[11px] text-white/72 transition hover:bg-white/8 hover:text-white"
                iconClassName="h-5 w-5 shrink-0"
                labelClassName="mt-1 whitespace-nowrap"
              />
            ) : (
              <div />
            )}

            {profileLink ? (
              <ActiveLink
                item={profileLink}
                isActive={getIsActive(pathname, profileLink.href)}
                className="flex min-h-16 flex-col items-center justify-center rounded-[14px] px-3 py-2 text-[11px] text-white/72 transition hover:bg-white/8 hover:text-white"
                iconClassName="h-5 w-5 shrink-0"
                labelClassName="mt-1 whitespace-nowrap"
              />
            ) : (
              <div />
            )}
          </aside>
        </GlassContainer>
      </div>
    </div>
  )
}

const SideBar = ({
  links,
  name = 'username',
  roleLabel = 'student',
  avatarLabel = 'A',
}: SideBarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const dashboardLink = useMemo(
    () => links.find((item) => item.title === 'Dashboard') ?? links[0],
    [links],
  )
  const profileLink = useMemo(
    () =>
      links.find((item) => item.title === 'Profile') ?? links[links.length - 1],
    [links],
  )
  const mobileMenuLinks = useMemo(
    () =>
      links.filter(
        (item) =>
          item.href !== dashboardLink?.href && item.href !== profileLink?.href,
      ),
    [dashboardLink?.href, links, profileLink?.href],
  )

  const handleLogout = () => {
    logout()
    void navigate({ to: '/auth/login', replace: true })
  }

  return (
    <>
      <DesktopSideBar
        links={links}
        pathname={location.pathname}
        avatarLabel={avatarLabel}
        name={name}
        roleLabel={roleLabel}
        onLogout={handleLogout}
      />
      <MobileSideBar
        dashboardLink={dashboardLink}
        menuLinks={mobileMenuLinks}
        onLogout={handleLogout}
        pathname={location.pathname}
        profileLink={profileLink}
      />
    </>
  )
}

export default SideBar
