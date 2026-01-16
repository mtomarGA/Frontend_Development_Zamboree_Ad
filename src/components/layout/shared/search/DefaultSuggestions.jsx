// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import menuConfig from '@/configs/verticalMenu.json'
import classnames from 'classnames'
import { getLocalizedUrl } from '@/utils/i18n'

// Icon imports for iconComponent support
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
  Mail as LucideMail,
  Puzzle,
  Settings,
  Trophy
} from 'lucide-react'

// Helper to resolve icon from string or iconComponent
const resolveIcon = icon => {
  if (!icon) return null
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
    LucideMail: <LucideMail size={20} />
  }
  if (map[icon]) return map[icon]
  // fallback for string class
  return <i className={icon + ' flex text-xl'} />
}

const flattenMenuToSections = (menu, hasPermission, parentSection = null) => {
  let sections = []
  menu.forEach(item => {
    if (item.type === 'item' && item.label && item.href) {
      if (!item.permissions || item.permissions.length === 0 || item.permissions.some(p => hasPermission(p))) {
        const sectionLabel = parentSection || 'Main Section'
        let section = sections.find(s => s.sectionLabel === sectionLabel)
        if (!section) {
          section = { sectionLabel, items: [] }
          sections.push(section)
        }
        section.items.push({
          label: item.label,
          href: item.href,
          icon: item.icon || item.iconComponent
        })
      }
    } else if (item.type === 'submenu' && item.children && item.children.length > 0) {
      if (!item.permissions || item.permissions.length === 0 || item.permissions.some(p => hasPermission(p))) {
        const sectionLabel = item.label || parentSection
        const childSections = flattenMenuToSections(item.children, hasPermission, sectionLabel)
        childSections.forEach(childSection => {
          let section = sections.find(s => s.sectionLabel === childSection.sectionLabel)
          if (!section) {
            sections.push(childSection)
          } else {
            section.items.push(...childSection.items)
          }
        })
      }
    }
  })
  return sections
}

const DefaultSuggestions = ({ setOpen }) => {
  const { lang: locale } = useParams()
  const { hasPermission } = useAuth()
  const sections = flattenMenuToSections(menuConfig, hasPermission)

  return (
    <div className='flex grow flex-wrap gap-x-[48px] gap-y-8 plb-14 pli-16 overflow-y-auto overflow-x-hidden bs-full'>
      {sections.map((section, index) => (
        <div
          key={index}
          className='flex flex-col justify-center overflow-x-hidden gap-4 basis-full sm:basis-[calc((100%-3rem)/2)]'
        >
          <p className='text-xs leading-[1.16667] uppercase text-textDisabled tracking-[0.8px]'>
            {section.sectionLabel}
          </p>
          <ul className='flex flex-col gap-4'>
            {section.items.map((item, i) => (
              <li key={i} className='flex'>
                <Link
                  href={getLocalizedUrl(item.href, locale)}
                  className='flex items-center overflow-x-hidden cursor-pointer gap-2 hover:text-primary focus-visible:text-primary focus-visible:outline-0'
                  onClick={() => setOpen(false)}
                >
                  {item.icon && resolveIcon(item.icon)}
                  <p className='text-[15px] leading-[1.4667] truncate'>{item.label}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DefaultSuggestions
