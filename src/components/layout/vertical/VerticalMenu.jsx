// Next Imports
import { useParams, usePathname } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import menuConfig from '@/configs/verticalMenu.json'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
// import { TbAd, TbCalendar, TbMail, TbSpeakerphone, TbTicket } from 'react-icons/tb'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useAuth } from '@/contexts/AuthContext'
// import EventIcon from '@mui/icons-material/Event'
// import {
//   BarChart2,
//   BookOpenCheck,
//   BrainCircuit,
//   CalendarDays,
//   CheckCircle,
//   FileCheck,
//   FileQuestion,
//   ListTree,
//   Mail,
//   Puzzle,
//   Settings,
//   Trophy
// } from 'lucide-react'
// import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { icon } from 'leaflet'
// Icon component mapping for JSON-defined iconComponent values
import EventIcon from '@mui/icons-material/Event'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { TbAd, TbCalendar, TbMail, TbSpeakerphone, TbTicket } from 'react-icons/tb'
import {
  BarChart2,
  BookOpenCheck,
  BrainCircuit,
  CalendarDays,
  CheckCircle,
  FileCheck,
  FileQuestion,
  ListTree,
  Mail,
  Puzzle,
  Settings,
  Trophy
} from 'lucide-react'
import { FcShop } from "react-icons/fc"
import { GoRocket } from "react-icons/go";
import { BsShop } from "react-icons/bs";
import { RiChatFollowUpLine } from "react-icons/ri";
import { BsChatRightDots } from "react-icons/bs";

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  const pathname = usePathname()

  const { hasPermission, user } = useAuth()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Permission helper
  const canAccess = perms => !perms || !perms.length || perms.some(p => {
    return hasPermission(p)
  })

  // Map string key to React component or class-based icon
  const resolveIcon = item => {
    if (item.iconComponent) {
      const map = {
        EventIcon: <EventIcon size={20} />,
        TrackChangesIcon: <TrackChangesIcon />,
        TbTicket: <TbTicket size={20} />,
        TbAd: <TbAd size={20} />,
        TbCalendar: <TbCalendar size={20} />,
        TbMail: <TbMail size={20} />,
        TbSpeakerphone: <TbSpeakerphone size={20} />,
        FileQuestion: <FileQuestion size={20} />,
        BookOpenCheck: <BookOpenCheck size={20} />,
        Trophy: <Trophy size={20} />,
        BrainCircuit: <BrainCircuit size={20} />,
        Puzzle: <Puzzle size={20} />,
        CheckCircle: <CheckCircle size={20} />,
        BarChart2: <BarChart2 size={20} />,
        SettingsIcon: <Settings size={20} />,
        FcShop: <FcShop size={20} />,
        GoRocket: <GoRocket size={20} />,
        BsShop: <BsShop size={20} />,
        RiChatFollowUpLine: <RiChatFollowUpLine size={20} />,
        BsChatRightDots: <BsChatRightDots size={20} />


      }
      return map[item.iconComponent] || undefined
    }
    if (item.icon) return <i className={item.icon} />
    return undefined
  }

  // Build locale aware href with optional employee suffix logic
  const buildHref = item => {
    if (!item.href) return '#'
    let base = `/${locale}/${item.href.startsWith('/') ? '' : '/'}${item.href.replace(/^\//, '')}`
    if (item.employeeSuffix && user?.userType === 'Employee') {
      base = `${base}/${user?.userId?._id}`
    }
    return base
  }

  // Active URL logic (supports contains or base arrays)
  const buildActiveUrl = item => {
    const active = []
    if (item.activeUrlBase && Array.isArray(item.activeUrlBase)) {
      active.push(...item.activeUrlBase.map(p => `/${locale}${p}`))
    }
    if (item.activeUrlContains && Array.isArray(item.activeUrlContains)) {
      // For contains we push current pathname if it includes pattern so component stays active
      item.activeUrlContains.forEach(pattern => {
        if (pathname.includes(pattern)) active.push(pathname)
      })
    }
    return active.length ? active : undefined
  }

  const renderMenuNodes = (items = []) => {
    return items
      .filter(item => canAccess(item.permissions))
      .map((item, idx) => {
        const key = `${item.label}-${idx}`
        if (item.type === 'submenu') {
          // Recursively filter children
          const children = renderMenuNodes(item.children || [])
          if (!children.length) return null
          return (
            <SubMenu key={key} label={item.label} icon={resolveIcon(item)}>
              {children}
            </SubMenu>
          )
        }
        if (item.type === 'item') {
          return (
            <MenuItem
              key={key}
              href={buildHref(item)}
              icon={resolveIcon(item)}
              exactMatch={item.exactMatch !== undefined ? item.exactMatch : true}
              activeUrl={buildActiveUrl(item)}
            >
              {item.label}
            </MenuItem>
          )
        }
        return null
      })
  }

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {renderMenuNodes(menuConfig)}
      </Menu>
      {/* </Menu> */}
    </ScrollWrapper>
  )
}
export default VerticalMenu
