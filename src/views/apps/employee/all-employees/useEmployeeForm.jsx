import { useState, useEffect } from 'react'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import maritalStatus from '@/services/customers/maritalstatus'
import Gender from '@/services/customers/gender'
import DesignationService from '@/services/employee/Master/DesignationService'
import BranchService from '@/services/employee/Master/BranchService'
import DepartmentService from '@/services/employee/Master/DepartmentService'

const initialFormData = {
    firstname: '',
    lastname: '',
    employeeid: 'EMP0001',
    email: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    gender: '',
    dob: '',
    designation: '',
    department: '',
    maritalStatus: '',
    joiningDate: '',
    role: '',
    branch: '',
}

const initSecurityFormData = {
    username: '',
    password: '',
    confirmPassword: '',
    login_access: true,
    attendance_type: 'manual',
}


const getInitialErrors = (fields) => {
    const errors = {}
    for (const key in fields) {
        errors[key] = ''
    }
    return errors
}

export const useEmployeeForm = (onSuccess) => {
    const [formData, setFormData] = useState(initialFormData)
    const [securityFormData, setSecurityFormData] = useState(initSecurityFormData)
    const [errors, setErrors] = useState(getInitialErrors(initialFormData))
    const [securityErrors, setSecurityErrors] = useState(getInitialErrors(initSecurityFormData))

    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [maritalStatusList, setMaritalStatusList] = useState([])
    const [genderList, setGenderList] = useState([])
    const [designationList, setDesignationList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [branchList, setBranchList] = useState([])
    
    const [roleList] = useState([
        { _id: '1', name: 'Admin' },
        { _id: '2', name: 'Employee' },
        { _id: '3', name: 'User' },
    ])




    useEffect(() => {
        getCountry()
        getMaritalStatus()
        getGender()
        getDesignation()
        getDepartment()
        getBranch()
    }, [])

    const getCountry = async () => {
        const result = await countryService.getCountries()
        setCountryList(result.data)
    }

    const getStatesbyId = async (CountryId) => {
        const result = await stateService.getStateById(CountryId)
        setStateList(result.data)
    }

    const getCityByStateId = async (stateId) => {
        const result = await CityService.getCityById(stateId)
        setCityList(result.data)
    }

    const getMaritalStatus = async () => {
        const result = await maritalStatus.getMaritalStatus()
        setMaritalStatusList(result.data)
    }

    const getGender = async () => {
        const result = await Gender.getGender()
        setGenderList(result.data)
    }

    const getDesignation = async () => {
        const result = await DesignationService.get()
        setDesignationList(result.data)
    }

    const getDepartment = async () => {
        const result = await DepartmentService.get()
        setDepartmentList(result.data)
    }

    const getBranch = async () => {
        const result = await BranchService.get()
        setBranchList(result.data)
    }

    const handleChange = (field) => (e) => {
        const value = e.target.value
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const handleSecurityChange = (field) => (e) => {
        const value = e.target.value
        setSecurityFormData((prev) => ({ ...prev, [field]: value }))
        if (securityErrors[field]) {
            setSecurityErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }




    const validate = () => {
        const newErrors = getInitialErrors(initialFormData)
        let valid = true

        if (!formData.firstname.trim()) {
            newErrors.firstname = 'First Name is required'
            valid = false
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = 'Last Name is required'
            valid = false
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
            valid = false
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid'
            valid = false
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required'
            valid = false
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits'
            valid = false
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required'
            valid = false
        }

        const requiredFields = ['country', 'state', 'city', 'pincode', 'dob', 'designation', 'department', 'maritalStatus', 'joiningDate', 'role', 'branch']
        requiredFields.forEach((field) => {
            if (!formData[field].trim()) {
                newErrors[field] = `${field} is required`
                valid = false
            }
        })

        setErrors(newErrors)
        return valid
    }

    const validateSecurity = () => {
        const newErrors = getInitialErrors(initSecurityFormData)
        let valid = true

        if (!securityFormData.username.trim()) {
            newErrors.username = 'Username is required'
            valid = false
        }
        if (!securityFormData.password.trim()) {
            newErrors.password = 'Password is required'
            valid = false
        } else if (securityFormData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            valid = false
        }

        if (securityFormData.confirmPassword !== securityFormData.password) {
            newErrors.confirmPassword = 'Passwords do not match'
            valid = false
        }

        setSecurityErrors(newErrors)
        return valid
    }

    const [documentErrors, setDocumentErrors] = useState({
        documentType: '',
        fileURL: ''
    })
    const [documentFormData, setDocumentFormData] = useState({
        documentType: '',
        fileURL: ''
    })

    const [documentList, setDocumentList] = useState([])

    const handleDocumentChange = (field, value) => {
        setDocumentFormData(prev => ({
            ...prev,
            [field]: value
        }))
        setDocumentErrors(prev => ({
            ...prev,
            [field]: '' // Clear error on change
        }))
    }

    const validateDocument = () => {
        let valid = true
        const errors = {}

        if (!documentFormData.documentType) {
            errors.documentType = 'Document type is required'
            valid = false
        }

        if (!documentFormData.fileURL) {
            errors.fileURL = 'File URL is required'
            valid = false
        }

        setDocumentErrors(errors)
        return valid
    }

    const addDocument = () => {
        setDocumentList(prev => [...prev, documentFormData])

        // Reset form data after adding
        setDocumentFormData({
            documentType: '',
            fileURL: ''
        })
    }
    const updateDocument = (index) => {
        setDocumentList(prev => prev.map((doc, i) => (i === index ? documentFormData : doc)))

        // Reset form data after updating
        setDocumentFormData({
            documentType: '',
            fileURL: ''
        })
    }


    const removeDocument = (index) => {
        setDocumentList(prev => prev.filter((_, i) => i !== index))
    }

    console.log('Document List:', documentList)
    console.log('Document Form Data:', documentFormData);





    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form Data:', formData);

        const validPersonal = validate()
        const validSecurity = validateSecurity()
        if (!validPersonal || !validSecurity) return

        console.log('Personal Data:', formData)
        console.log('Security Data:', securityFormData)
        onSuccess()
    }

    return {
        formData,
        errors,
        handleChange,
        securityFormData,
        securityErrors,
        handleSecurityChange,
        handleSubmit,
        countryList,
        stateList,
        cityList,
        maritalStatusList,
        genderList,
        designationList,
        departmentList,
        branchList,
        getStatesbyId,
        getCityByStateId,
        roleList,
        validateSecurity,
        documentFormData,
        documentErrors,
        documentList,
        handleDocumentChange,
        validateDocument,
        addDocument,
        removeDocument,
        setDocumentFormData,
        updateDocument,
    }
}
