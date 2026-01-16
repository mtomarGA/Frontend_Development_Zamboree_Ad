// 'use client'
// import { createContext, useEffect, useMemo, useState } from 'react'

// // Config Imports
// import themeConfig from '@configs/themeConfig'
// import primaryColorConfig from '@configs/primaryColorConfig'
// import companyData from '@/services/premium-listing/banner.service'
// // Hook Imports
// import { useObjectCookie } from '@core/hooks/useObjectCookie'

// // Initial Settings Context
// export const SettingsContext = createContext(null)

// // Settings Provider
// export const SettingsProvider = (props) => {
//   const [data, setData] = useState()

//   useEffect(() => {
//     let isMounted = true

//     const fetchCompanyData = async () => {
//       try {
//         const result = await companyData.CompanyDetails()
//         if (isMounted) {
//           console.log(result?.data, "resultresultresult")
//           setData(result?.data)
//         }
//       } catch (error) {
//         console.error("Failed to fetch company data:", error)
//       }
//     }

//     fetchCompanyData()

//     return () => {
//       isMounted = false
//     }
//   }, [])


//   // Initial Settings
//   const initialSettings = {
//      data,
//     mode: themeConfig.mode,
//     skin: themeConfig.skin,
//     semiDark: themeConfig.semiDark,
//     layout: themeConfig.layout,
//     navbarContentWidth: themeConfig.navbar.contentWidth,
//     contentWidth: themeConfig.contentWidth,
//     footerContentWidth: themeConfig.footer.contentWidth,
//     primaryColor: primaryColorConfig[0].main
//   }

//   const updatedInitialSettings = {
//     ...initialSettings,
//     mode: props.mode || themeConfig.mode
//   }

//   // Cookies
//   const [settingsCookie, updateSettingsCookie] = useObjectCookie(
//     themeConfig.settingsCookieName,
//     JSON.stringify(props.settingsCookie) !== '{}' ? props.settingsCookie : updatedInitialSettings
//   )

//   // State
//   const [_settingsState, _updateSettingsState] = useState(
//     JSON.stringify(settingsCookie) !== '{}' ? settingsCookie : updatedInitialSettings
//   )

//   const updateSettings = (settings, options) => {
//     const { updateCookie = true } = options || {}

//     _updateSettingsState(prev => {
//       const newSettings = { ...prev, ...settings }

//       // Update cookie if needed
//       if (updateCookie) updateSettingsCookie(newSettings)

//       return newSettings
//     })
//   }

//   /**
//    * Updates the settings for page with the provided settings object.
//    * Updated settings won't be saved to cookie hence will be reverted once navigating away from the page.
//    *
//    * @param settings - The partial settings object containing the properties to update.
//    * @returns A function to reset the page settings.
//    *
//    * @example
//    * useEffect(() => {
//    *     return updatePageSettings({ theme: 'dark' });
//    * }, []);
//    */
//   const updatePageSettings = settings => {
//     updateSettings(settings, { updateCookie: false })

//     // Returns a function to reset the page settings
//     return () => updateSettings(settingsCookie, { updateCookie: false })
//   }

//   const resetSettings = () => {
//     updateSettings(initialSettings)
//   }

//   const isSettingsChanged = useMemo(
//     () => JSON.stringify(initialSettings) !== JSON.stringify(_settingsState),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [_settingsState]
//   )

//   return (
//     <SettingsContext.Provider
//       value={{
//         settings: _settingsState,
//         updateSettings,
//         isSettingsChanged,
//         resetSettings,
//         updatePageSettings,
//         data
//       }}
//     >
//       {props.children}
//     </SettingsContext.Provider>
//   )
// }


'use client'

import { createContext, useEffect, useMemo, useState } from 'react'

// Config Imports
import themeConfig from '@configs/themeConfig'
import primaryColorConfig from '@configs/primaryColorConfig'
import companyData from '@/services/premium-listing/banner.service'

// Hook Imports
import { useObjectCookie } from '@core/hooks/useObjectCookie'

// Create Context
export const SettingsContext = createContext(null)

// Provider Component
export const SettingsProvider = props => {
  const [companyDataState, setCompanyDataState] = useState(null)

  // ----------------------------
  // Fetch Company Data (once)
  // ----------------------------
  useEffect(() => {
    let isMounted = true

    const fetchCompanyData = async () => {
      try {
        const result = await companyData.CompanyDetails()
        // console.log('🌐 Full API Result:', result)

        if (isMounted) {
          // ✅ Handle different API response shapes
          const parsedData =
            result?.data?.[0] || 
            result?.[0] || 
            result?.data || 
            null

          // console.log('✅ Parsed Company Data:', parsedData)
          setCompanyDataState(parsedData)
        }
      } catch (error) {
        console.error('❌ Failed to fetch company data:', error)
      }
    }

    fetchCompanyData()

    return () => {
      isMounted = false
    }
  }, [])

  // ----------------------------
  // Memoized Initial Settings
  // ----------------------------
  const initialSettings = useMemo(
    () => ({
      data: companyDataState,
      mode: themeConfig.mode,
      skin: themeConfig.skin,
      semiDark: themeConfig.semiDark,
      layout: themeConfig.layout,
      navbarContentWidth: themeConfig.navbar.contentWidth,
      contentWidth: themeConfig.contentWidth,
      footerContentWidth: themeConfig.footer.contentWidth,
      primaryColor: primaryColorConfig[0].main
    }),
    [companyDataState]
  )

  // console.log('🧩 Current companyDataState:', companyDataState)

  const updatedInitialSettings = {
    ...initialSettings,
    mode: props.mode || themeConfig.mode
  }

  // ----------------------------
  // Cookies
  // ----------------------------
  const [settingsCookie, updateSettingsCookie] = useObjectCookie(
    themeConfig.settingsCookieName,
    JSON.stringify(props.settingsCookie) !== '{}'
      ? props.settingsCookie
      : updatedInitialSettings
  )

  // ----------------------------
  // State
  // ----------------------------
  const [_settingsState, _updateSettingsState] = useState(
    JSON.stringify(settingsCookie) !== '{}'
      ? settingsCookie
      : updatedInitialSettings
  )

  // ✅ Sync settings when company data changes
  useEffect(() => {
    if (companyDataState) {
      _updateSettingsState(prev => ({
        ...prev,
        data: companyDataState
      }))
      console.log('✅ Synced company data into _settingsState')
    }
  }, [companyDataState])

  // ----------------------------
  // Update Settings
  // ----------------------------
  const updateSettings = (settings, options) => {
    const { updateCookie = true } = options || {}

    _updateSettingsState(prev => {
      const newSettings = { ...prev, ...settings }

      if (updateCookie) updateSettingsCookie(newSettings)

      return newSettings
    })
  }

  // ----------------------------
  // Update Page-Specific Settings (Temporary)
  // ----------------------------
  const updatePageSettings = settings => {
    updateSettings(settings, { updateCookie: false })

    // Revert when unmounted
    return () => updateSettings(settingsCookie, { updateCookie: false })
  }

  // ----------------------------
  // Reset Settings
  // ----------------------------
  const resetSettings = () => {
    updateSettings(initialSettings)
  }

  // ----------------------------
  // Detect Settings Change
  // ----------------------------
  const isSettingsChanged = useMemo(
    () => JSON.stringify(initialSettings) !== JSON.stringify(_settingsState),
    [_settingsState, initialSettings]
  )

  // ----------------------------
  // Memoized Context Value
  // ----------------------------
  const contextValue = useMemo(
    () => ({
      settings: _settingsState,
      updateSettings,
      isSettingsChanged,
      resetSettings,
      updatePageSettings,
      companyData: companyDataState
    }),
    [_settingsState, isSettingsChanged, companyDataState]
  )

  // ----------------------------
  // Render Provider
  // ----------------------------
  return (
    <SettingsContext.Provider value={contextValue}>
      {props.children}
    </SettingsContext.Provider>
  )
}
