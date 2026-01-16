'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import countryService from '@/services/location/country.services';
import stateService from '@/services/location/state.services';
import CityService from '@/services/location/city.service';
import maritalStatus from '@/services/customers/maritalstatus';
import Gender from '@/services/customers/gender';
import DesignationService from '@/services/employee/Master/DesignationService';
import BranchService from '@/services/employee/Master/BranchService';
import DepartmentService from '@/services/employee/Master/DepartmentService';
import EmployeeService from '@/services/employee/EmployeeService';
import RoleService from '@/services/role/roleService';
import ServiceCategory from "@/services/business/service/serviceCategory.service"
// --- Initial State Definitions ---
const initialFormData = {
    firstName: '',
    lastName: '',
    employee_id: 'EMP0001',
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
    reportingto: '',
    working_shift: '',
    categories: ''

};

const initSecurityFormData = {
    username: '',
    password: '',
    confirmPassword: '',
    loginAccess: true,
    attendance_type: 'manual',
};

const initBankFormData = {
    accountNumber: '',
    accountHolderName: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
}

const init_email_configuration = {
    smtp_host: 'smtp.hostinger.com',
    smtp_port: '465',
    imap_host: 'imap.hostinger.com',
    imap_port: '993',
    smtp_email: '',
    smtp_password: ''
}


const getInitialErrors = (fields) => {
    const errors = {};
    for (const key in fields) {
        errors[key] = '';
    }
    return errors;
};

// --- Create Context ---
const EmployeeFormContext = createContext();

// --- Create Provider Component ---
export const EmployeeFormProvider = ({ children, onSuccess }) => {
    const [formData, setFormData] = useState(initialFormData)
    const [emailConfig, setEmailConfig] = useState(init_email_configuration)
    const [emailConfigErrors, setEmailConfigErrors] = useState(getInitialErrors(init_email_configuration))
    const [securityFormData, setSecurityFormData] = useState(initSecurityFormData)
    const [leaveFormData, setLeaveFormData] = useState(initSecurityFormData)
    const [errors, setErrors] = useState(getInitialErrors(initialFormData))
    const [securityErrors, setSecurityErrors] = useState(getInitialErrors(initSecurityFormData))
    const [documentErrors, setDocumentErrors] = useState({
        documentType: '',
        fileURL: ''
    })
    const [isEditMode, setIsEditMode] = useState(false); // Add edit mode state
    const [editEmployeeId, seteditEmployeeId] = useState('')
    const [documentFormData, setDocumentFormData] = useState({
        documentType: '',
        fileURL: ''
    })
    const [tabManagement, setTabManagement] = useState({
        General: {
            basic: true,
            security: false,
            document: false,
            bank: false,
            leave: false
        }
    })

    const [documentList, setDocumentList] = useState([])
    const [bankFormData, setBankFormData] = useState(initBankFormData)
    const [bankErrors, setBankErrors] = useState(getInitialErrors(initBankFormData))
    const [loadingCategories, setLoadingCategories] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [categories, setCategories] = useState([])
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [maritalStatusList, setMaritalStatusList] = useState([])
    const [genderList, setGenderList] = useState([])
    const [designationList, setDesignationList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [officePolicy, setOfficePolicy] = useState([])
    const [workingShiftList, setWorkingShiftList] = useState([]) // Added working shift list

    const [reportingToList, setReportingToList] = useState([]) // Added reporting to list

    const [roleList, setRoleList] = useState([])




    useEffect(() => {
        getCountry()
        getMaritalStatus()
        getGender()
        getDesignation()
        getDepartment()
        getBranch()
        getRoles()
        getReportingTo()
        getWorkingShift()
    }, [])

    const getCountry = async () => {
        const result = await countryService.getCountries()
        setCountryList(result.data)
    }

    const getRoles = async () => {
        const result = await RoleService.get()
        console.log('Roles:', result.data);
        setRoleList(result.data)
    }

    const getReportingTo = async () => {
        const result = await EmployeeService.getList()
        setReportingToList(result.data)
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

    const getWorkingShift = async () => {
        const result = await EmployeeService.getAllShift()
        setWorkingShiftList(result.data)
    }

    const handleSecurityChange = (field) => (e) => {
        const value = e.target.value
        setSecurityFormData((prev) => ({ ...prev, [field]: value }))
        if (securityErrors[field]) {
            setSecurityErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const handleChange = (field) => (e) => {
        const value = e.target.value
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (field === 'email') {
            handleSecurityChange('username')(e)
            handleEmailConfigChange('smtp_email')(e)
        }
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const resetTabManagement = () => {
        setTabManagement({
            General: {
                basic: true,
                security: false,
                document: false,
                bank: false,
                leave: false,
                email_configuration: false
            }
        })
    }



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

    const handleBankChange = (field) => (e) => {
        const value = e.target.value
        setBankFormData((prev) => ({ ...prev, [field]: value }))
        if (bankErrors[field]) {
            setBankErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const handleEmailConfigChange = (field) => (e) => {
        const value = e.target.value
        setEmailConfig((prev) => ({ ...prev, [field]: value }))
        if (emailConfigErrors[field]) {
            setEmailConfigErrors((prev) => ({ ...prev, [field]: '' }))
        }
    }

    const validateEmailConfig = () => {
        const newErrors = getInitialErrors(init_email_configuration)
        let valid = true
        if (!emailConfig.smtp_host) {
            newErrors.smtp_host = 'SMTP Host is required'
            valid = false
        }
        if (!emailConfig.smtp_port) {
            newErrors.smtp_port = 'SMTP Port is required'
            valid = false
        }
        if (!emailConfig.imap_host) {
            newErrors.imap_host = 'IMAP Host is required'
            valid = false
        }
        if (!emailConfig.imap_port) {
            newErrors.imap_port = 'IMAP Port is required'
            valid = false
        }
        if (!emailConfig.smtp_email) {
            newErrors.smtp_email = 'SMTP Email is required'
            valid = false
        }

        setEmailConfigErrors(newErrors)
        return valid
    }

    const validate = () => {
        const newErrors = getInitialErrors(initialFormData)
        let valid = true

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First Name is required'
            valid = false
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required'
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
        if (formData.categories.length <= 0) {
            newErrors.categories = 'categories is required'
            valid = false
        }


        const requiredFields = [
            'country', 'state', 'city', 'categories', 'pincode', 'dob',
            'designation', 'department', 'maritalStatus', 'joiningDate',
            'role', 'branch', 'reportingto', 'gender', 'working_shift'
        ];

        requiredFields.forEach((field) => {
            const value = formData[field];

            if (typeof value === 'string' && !value.trim()) {
                newErrors[field] = `${field} is required`;
                valid = false;
            } else if (Array.isArray(value) && value.length === 0) {
                newErrors[field] = `${field} is required`;
                valid = false;
            } else if (value == null) { // catches null or undefined
                newErrors[field] = `${field} is required`;
                valid = false;
            }
        });

        setErrors(newErrors)
        if (valid) {
            //update tab management state
            setTabManagement(prev => ({
                ...prev,
                General: {
                    ...prev.General,
                    security: true,
                }
            }))
        }
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
        if (valid) {
            //update tab management state
            setTabManagement(prev => ({
                ...prev,
                General: {
                    ...prev.General,
                    document: true,
                }
            }))
        }
        return valid
    }
    const validateBank = () => {
        const newErrors = getInitialErrors(initBankFormData)
        let valid = true
        if (!bankFormData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account Number is required'
            valid = false
        }
        if (!bankFormData.accountHolderName.trim()) {
            newErrors.accountHolderName = 'Account Holder Name is required'
            valid = false
        }
        if (!bankFormData.ifscCode.trim()) {
            newErrors.ifscCode = 'IFSC Code is required'
            valid = false
        }
        if (!bankFormData.bankName.trim()) {
            newErrors.bankName = 'Bank Name is required'
            valid = false
        }
        if (!bankFormData.branchName.trim()) {
            newErrors.branchName = 'Branch Name is required'
            valid = false
        }
        setBankErrors(newErrors)
        return valid
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

    // --- Form Reset Function ---
    const resetForm = () => {
        setIsEditMode(false);
        seteditEmployeeId(null);
        setFormData(initialFormData);
        setSecurityFormData(initSecurityFormData);
        setBankFormData(initBankFormData);
        setDocumentFormData({
            documentType: '',
            fileURL: ''
        });
        setDocumentList([]);
        setErrors(getInitialErrors(initialFormData));
        setSecurityErrors(getInitialErrors(initSecurityFormData));
        setBankErrors(getInitialErrors(initBankFormData));
        setDocumentErrors(getInitialErrors({
            documentType: '',
            fileURL: ''
        }));
        // Reset fetched lists that depend on selections if necessary
        setStateList([]);
        setCityList([]);
        setEmailConfigErrors(getInitialErrors(init_email_configuration));
        setEmailConfig(init_email_configuration);
    };

    const handleLoadData = async (id) => {
        const { data } = await EmployeeService.getEmployeeById(id);
        if (!data) return;
        console.log('Received Data:', data.reportingto)
        setIsEditMode(true);
        seteditEmployeeId(data._id)

        console.log('Received Data:', data);
        setLeaveFormData(
            data.leave
        )

        setFormData({
            firstName: data.name.split(' ')[0] || '',
            lastName: data.name.split(' ')[1] || '',
            employee_id: data.employee_id || 'EMP0001',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address?.street || '',
            country: data.address?.country?._id || '',
            state: data.address?.state?._id || '',
            city: data.address?.city?._id || '',
            pincode: data.address?.pincode || '',
            gender: data.gender?._id,
            dob: data.dob.split('T')[0] || '',
            designation: data.designation?._id || '',
            department: data.department?._id,
            maritalStatus: data.maritalStatus?._id || '',
            joiningDate: data.joiningDate.split('T')[0] || '',
            role: data.role || '',
            reportingto: data.reportingto[0]?._id || '', // Added reportingto field
            branch: data.branch?._id || '',
            working_shift: data.working_shift?._id || '',
            officePolicy: data.weeklyOff,
            categories: data?.categories || '',
        })
        setSecurityFormData({
            username: data.email || '',
            password: '',
            confirmPassword: '',
            loginAccess: data.user_id?.loginAccess || false,
            attendance_type: data?.attendance_type || 'manual'
        })
        setBankFormData({
            accountNumber: data.bankDetails?.accountNumber || '',
            accountHolderName: data.bankDetails?.accountHolderName || '',
            ifscCode: data.bankDetails?.ifscCode || '',
            bankName: data.bankDetails?.bankName || '',
            branchName: data.bankDetails?.branchName || ''
        })
        // tab management state
        setTabManagement({
            General: {
                basic: true,
                security: true,
                document: true,
                leave: true,
                bank: true,
                email_configuration: true
            }
        })
        setEmailConfig({
            smtp_host: data.email_configuration?.smtp_host || '',
            smtp_port: data.email_configuration?.smtp_port || '',
            smtp_email: data.email_configuration?.smtp_email || '',
            imap_host: data.email_configuration?.imap_host || '',
            imap_port: data.email_configuration?.imap_port || '',
            imap_email: data.email_configuration?.imap_email || ''
        })
        if (data.address?.country) {
            await getStatesbyId(data.address?.country?._id); // await to ensure state list is populated
        }
        if (data.address?.state) {
            await getCityByStateId(data.address?.state?._id); // await to ensure city list is populated
        }
        const docs = data.documents?.map(doc => ({
            documentType: doc.documentType._id || '',
            fileURL: doc.fileURL || ''
        })) || []
        setDocumentList(docs || [])

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Form Data:', formData);

        const validPersonal = validate()
        const validSecurity = validateSecurity()
        const validBank = validateBank()
        if (!validateEmailConfig()) return

        // if (!validPersonal || !validBank || (!isEditMode && !validSecurity)) return

        console.log('Personal Data:', formData)
        console.log('Security Data:', securityFormData)
        console.log('Document Data:', documentList)
        console.log('Bank Data:', bankFormData)
        const address = {
            country: formData.country,
            state: formData.state,
            city: formData.city,
            pincode: formData.pincode,
            street: formData.address
        }
        const personalDetails = {
            ...formData,
            address: address,
        }
        const employeeData = {
            ...personalDetails,
            securityDetails: securityFormData,
            documents: documentList,
            bankDetails: bankFormData,
            email_configuration: emailConfig,
        }
        const employeeLeaveData = {
            ...employeeData,
            leave: leaveFormData,
        };
        // console.log('Employee Data:', employeeLeaveData)
        try {
            if (isEditMode) {
                // Update employee logic here
                const response = await EmployeeService.updateEmployee(editEmployeeId, employeeLeaveData)
                console.log('Employee updated successfully:', response)

            } else {
                console.log(employeeLeaveData, "employeeDatahngbfvdcsxdv");

                const response = await EmployeeService.createEmployee(employeeLeaveData)
                console.log('Employee created successfully:', response)
            }
        } catch (error) {
            console.error('Error creating employee:', error);
        }

        onSuccess()
        resetForm() // Reset the form after submission
        resetTabManagement() // Reset tab management state
    }

    const deleteEmployee = async (id) => {
        try {
            const response = await EmployeeService.deleteEmployee(id)
            console.log('Employee deleted successfully:', response)
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }


    const fetchCategories = async (query = '') => {


        setLoadingCategories(true)
        const result = await ServiceCategory.searchParentCategory(query)
        console.log(result, "resultresultresult");

        if (result.data && Array.isArray(result.data)) {
            setCategories(result.data)
        } else if (result.success && result.data) {
            setCategories([result.data])
        } else {
            setCategories([])
        }

    }

    useEffect(() => {
        fetchCategories()
    }, [])

    // Debounced search for categories
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim() !== '') {
                fetchCategories(searchQuery)
            } else {
                fetchCategories()
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])





    // --- Context Value ---
    const value = {
        officePolicy,
        formData,
        errors,
        handleChange,
        securityFormData,
        securityErrors,
        handleSecurityChange,
        documentFormData,
        documentErrors,
        documentList,
        handleDocumentChange,
        validateDocument,
        addDocument,
        removeDocument,
        setDocumentFormData, // Keep if direct setting is needed (e.g., for editing)
        updateDocument,
        countryList,
        stateList,
        cityList,
        maritalStatusList,
        genderList,
        designationList,
        departmentList,
        branchList,
        roleList,
        getStatesbyId, // Expose if needed directly by components
        getCityByStateId, // Expose if needed directly by components
        validate, // Expose validation functions
        validateSecurity,
        handleSubmit, // Expose the main submit handler
        bankFormData,
        bankErrors,
        handleBankChange,
        validateBank,
        handleLoadData,
        isEditMode,
        deleteEmployee,
        resetForm,
        tabManagement,
        setTabManagement,
        reportingToList,
        emailConfig,
        emailConfigErrors,
        handleEmailConfigChange,
        validateEmailConfig,
        workingShiftList,
        leaveFormData,
        setLeaveFormData,
        categories,
        setCategories,
        setSearchQuery,
        loadingCategories
    };

    return (
        <EmployeeFormContext.Provider value={value}>
            {children}
        </EmployeeFormContext.Provider>
    );
};

// --- Custom Hook for Consuming Context ---
export const useEmployeeFormContext = () => {
    const context = useContext(EmployeeFormContext);
    if (context === undefined) {
        throw new Error('useEmployeeFormContext must be used within an EmployeeFormProvider');
    }
    return context;
};
