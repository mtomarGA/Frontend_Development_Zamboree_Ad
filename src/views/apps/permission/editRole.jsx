'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import RoleService from '@/services/role/roleService'
import { useRouter } from 'next/navigation'
import { MODULES, PERMISSIONS } from './permissionData'
import { toast } from 'react-toastify'

export default function EditRole({ id }) {
  const [roleName, setRoleName] = useState('')
  const [permissions, setPermissions] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedRows, setSelectedRows] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const res = await RoleService.getById(id)
        const RoleData = res.data
        console.log('RoleData:', RoleData)

        setRoleName(RoleData.name)
        const filledPermissions = {}

        MODULES.forEach((module) => {
          if (module.submodules) {
            module.submodules.forEach((sub) => {
              const key = `${module.name}_${sub.name}`
              filledPermissions[key] = sub.permissions.reduce((acc, perm) => {
                acc[perm] = RoleData.permissions?.[key]?.includes(perm) || false
                return acc
              }, {})
            })
          } else {
            const key = module.name
            filledPermissions[key] = module.permissions.reduce((acc, perm) => {
              acc[perm] = RoleData.permissions?.[key]?.includes(perm) || false
              return acc
            }, {})
          }
        })

        setPermissions(filledPermissions)
      } catch (error) {
        console.error('Error fetching role data:', error)
        toast.error('Failed to load role data')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const handleCheckboxChange = (key, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [permission]: !prev[key][permission]
      }
    }))
  }

  const handleRowSelect = (moduleName) => {
    // Find the module to check if it has submodules
    const currentModule = MODULES.find(m => m.name === moduleName)
    const isSelected = !selectedRows[moduleName]

    const newSelectedRows = { ...selectedRows }
    const updatedPermissions = { ...permissions }

    if (currentModule && currentModule.submodules) {
      // If module has submodules, select/deselect all submodules
      currentModule.submodules.forEach(sub => {
        const key = `${currentModule.name}_${sub.name}`
        newSelectedRows[key] = isSelected

        // Update all permissions for each submodule
        Object.keys(permissions[key]).forEach(perm => {
          updatedPermissions[key][perm] = isSelected
        })
      })
    } else {
      // If no submodules, just toggle the module itself
      const key = moduleName
      newSelectedRows[key] = isSelected

      Object.keys(permissions[key]).forEach(perm => {
        updatedPermissions[key][perm] = isSelected
      })
    }

    // Update the main module selection state
    newSelectedRows[moduleName] = isSelected

    setSelectedRows(newSelectedRows)
    setPermissions(updatedPermissions)
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    const newSelectedRows = {}
    const updatedPermissions = { ...permissions }

    // Mark all main modules as selected
    MODULES.forEach(module => {
      newSelectedRows[module.name] = newSelectAll
    })

    // Update all permissions for all keys (including submodules)
    Object.keys(permissions).forEach(key => {
      newSelectedRows[key] = newSelectAll
      Object.keys(permissions[key]).forEach(perm => {
        updatedPermissions[key][perm] = newSelectAll
      })
    })

    setSelectedRows(newSelectedRows)
    setPermissions(updatedPermissions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const filteredPermissions = {}
    Object.entries(permissions).forEach(([moduleKey, perms]) => {
      const selectedPerms = Object.entries(perms)
        .filter(([_, isChecked]) => isChecked)
        .map(([perm]) => perm)

      if (selectedPerms.length > 0) {
        filteredPermissions[moduleKey] = selectedPerms
      }
    })

    const payload = {
      name: roleName,
      permission: filteredPermissions
    }

    console.log('Edited Payload:', payload)

    const res = await RoleService.update(id, payload)

  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading Role...</Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Edit Role</Typography>
        <Button variant="outlined" onClick={() => router.push('/en/apps/role')}>
          Back to List
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    indeterminate={Object.values(selectedRows).some(v => v) && !selectAll}
                  />
                </TableCell>
                <TableCell><strong>Main Module</strong></TableCell>
                <TableCell><strong>Sub Module</strong></TableCell>
                {/* <TableCell><strong>Permissions</strong></TableCell> */}
                {/* {PERMISSIONS.map(perm => (
                  <TableCell sx={{ textTransform: 'capitalize' }} key={perm}><strong>{perm}</strong></TableCell>
                ))} */}
                <TableCell colSpan={PERMISSIONS.length} align="center"><strong>Permissions</strong></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {MODULES.map((module) => {
                const isNested = !!module.submodules
                const submodules = isNested ? module.submodules : [{ name: '', permissions: module.permissions }]

                return submodules.map((sub, index) => {
                  const key = isNested ? `${module.name}_${sub.name}` : module.name
                  return (
                    <TableRow key={`${key}-${index}`}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={submodules.length}
                          sx={{ verticalAlign: 'middle' }}
                        >
                          <Checkbox
                            checked={selectedRows[module.name] || false}
                            onChange={() => handleRowSelect(module.name)}
                          />
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell
                          rowSpan={submodules.length}
                          sx={{ verticalAlign: 'top', textTransform: 'capitalize' }}
                        >
                          {module.name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) || '—'}
                        </TableCell>
                      )}
                      <TableCell sx={{ textTransform: 'capitalize' }}>
                        {sub.name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) || '—'}
                      </TableCell>
                      {PERMISSIONS.map((perm) => (
                        <TableCell key={perm}>
                          {sub.permissions.includes(perm) ? (
                            <>
                              <Checkbox
                                size="small"
                                checked={permissions[key]?.[perm] || false}
                                onChange={() => handleCheckboxChange(key, perm)}
                              />
                              <span style={{ textTransform: 'capitalize', fontSize: '14px' }}>{perm || '—'}</span>
                            </>
                          ) : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="contained" type="submit" sx={{ mt: 3 }}>
          Update Role
        </Button>
      </Box>
    </Container>
  )
}
