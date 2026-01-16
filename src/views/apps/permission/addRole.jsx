'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
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
import CustomTextField from '@/@core/components/mui/TextField'
import { useRouter } from 'next/navigation'
import { MODULES, PERMISSIONS } from './permissionData'
import RoleService from '@/services/role/roleService'

// Lowercase module names for the final API structure
// const MODULES = ['employees', 'todos', 'projects', 'tasks']
// const PERMISSIONS = ['view', 'edit', 'delete', 'add', 'global_view']

export default function AddRolePage({ setviewAddRole }) {
  const [roleName, setRoleName] = useState('')
  const [selectedRows, setSelectedRows] = useState({})
  const [selectAll, setSelectAll] = useState(false)

  // const [permissions, setPermissions] = useState(
  //   MODULES.reduce((acc, module) => {
  //     acc[module] = PERMISSIONS.reduce((permAcc, perm) => {
  //       permAcc[perm] = false
  //       return permAcc
  //     }, {})
  //     return acc
  //   }, {})
  // )
  const [permissions, setPermissions] = useState(() => {
    const initial = {}
    MODULES.forEach(mod => {
      if (mod.submodules) {
        mod.submodules.forEach(sub => {
          initial[`${mod.name}_${sub.name}`] = sub.permissions.reduce((acc, p) => {
            acc[p] = false
            return acc
          }, {})
        })
      } else {
        initial[mod.name] = mod.permissions.reduce((acc, p) => {
          acc[p] = false
          return acc
        }, {})
      }
    })
    return initial
  })

  const route = useRouter()

  // const handleCheckboxChange = (module, permission) => {
  //   setPermissions(prev => ({
  //     ...prev,
  //     [module]: {
  //       ...prev[module],
  //       [permission]: !prev[module][permission]
  //     }
  //   }))
  // }
  const handleCheckboxChange = (key, permission) => {
    setPermissions(prev => ({
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


  const handleSubmit = async e => {
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
      permissions: filteredPermissions
    }

    console.log('Final Payload:', payload)
    const res = await RoleService.create(payload)
  }



  return (
    <Container sx={{ py: 4 }} > {/* Added horizontal margin using sx */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Add Role</Typography>
        <Button variant="outlined" onClick={() => setviewAddRole(false)}>
          Back to List
        </Button>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <CustomTextField
          label="Role Name"
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
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
          Submit
        </Button>
      </Box>
    </Container>
  )
}
