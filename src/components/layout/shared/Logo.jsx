'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

// Third-party Imports
import styled from '@emotion/styled'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Local fallback image
import logoImage from '../../../../public/images/MyLogo/SmallLogoHappening.png'

const LogoText = styled.span`
  color: ${({ color }) => color ?? 'var(--mui-palette-text-primary)'};
  font-size: 1.3rem;
  line-height: 1.09091;
  font-weight: 700;
  letter-spacing: 0.25px;
  transition: ${({ transitionDuration }) =>
    `margin-inline-start ${transitionDuration}ms ease-in-out, opacity ${transitionDuration}ms ease-in-out`};

  ${({ isHovered, isCollapsed, isBreakpointReached }) =>
    !isBreakpointReached && isCollapsed && !isHovered
      ? 'opacity: 0; margin-inline-start: 0;'
      : 'opacity: 1; margin-inline-start: 12px;'}
`

const Logo = ({ color }) => {
  const logoTextRef = useRef(null)
  const { isHovered, transitionDuration, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  const { layout } = settings
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isTextLoading, setIsTextLoading] = useState(true)

  useEffect(() => {
    if (layout !== 'collapsed') return

    if (logoTextRef.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
  }, [isHovered, layout, isBreakpointReached])

  const imageSrc = settings.data?.icon || logoImage

  useEffect(() => {
    if (settings.data?.company_name) {
      setIsTextLoading(false)
    }
  }, [settings.data?.company_name])

  return (
    <div className='flex items-center'>
      {/* Logo image */}
      {isImageLoading && !settings.data?.icon ? (
        <div className='flex justify-center items-center w-[60px] h-[60px] bg-gray-100 rounded-2xl animate-pulse'>
          <span className='text-gray-400 text-sm'>...</span>
        </div>
      ) : (
        <img
          src={imageSrc}
          alt='Company Logo'
          width={60}
          height={60}
          className='text-2xl text-primary rounded-2xl'
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
      )}

      {/* Company name */}
      <LogoText
        color={color}
        ref={logoTextRef}
        isHovered={isHovered}
        isCollapsed={layout === 'collapsed'}
        transitionDuration={transitionDuration}
        isBreakpointReached={isBreakpointReached}
      >
        {isTextLoading ? (
          <span className='block w-28 h-4 bg-gray-100 rounded animate-pulse'></span>
        ) : (
          settings.data?.company_name
        )}
      </LogoText>
    </div>
  )
}

export default Logo
