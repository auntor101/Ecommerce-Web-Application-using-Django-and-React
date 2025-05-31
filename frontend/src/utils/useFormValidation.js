import { useState } from 'react'

export const useFormValidation = (initialValues, validationRules) => {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validateField = (name, value) => {
        const rules = validationRules[name]
        if (!rules) return ''

        for (const rule of rules) {
            const error = rule(value, values)
            if (error) return error
        }
        return ''
    }

    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }))
        
        if (touched[name]) {
            const error = validateField(name, value)
            setErrors(prev => ({ ...prev, [name]: error }))
        }
    }

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }))
        const error = validateField(name, values[name])
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const validateAll = () => {
        const newErrors = {}
        const newTouched = {}
        
        Object.keys(validationRules).forEach(name => {
            newTouched[name] = true
            const error = validateField(name, values[name])
            if (error) newErrors[name] = error
        })
        
        setTouched(newTouched)
        setErrors(newErrors)
        
        return Object.keys(newErrors).length === 0
    }

    const isValid = Object.values(errors).every(error => !error) && Object.keys(touched).length > 0

    return { 
        values, 
        errors, 
        touched, 
        handleChange, 
        handleBlur, 
        validateAll,
        isValid 
    }
}

// Validation rules
export const validationRules = {
    required: (value) => !value ? 'This field is required' : '',
    email: (value) => !/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : '',
    minLength: (min) => (value) => value.length < min ? `Minimum ${min} characters required` : '',
    maxLength: (max) => (value) => value.length > max ? `Maximum ${max} characters allowed` : '',
    phone: (value) => !/^01[0-9]{9}$/.test(value) ? 'Invalid phone number (01XXXXXXXXX)' : '',
    password: (value) => value.length < 6 ? 'Password must be at least 6 characters' : '',
    matchPassword: (confirmValue, values) => confirmValue !== values.password ? 'Passwords do not match' : '',
    number: (value) => isNaN(value) || value <= 0 ? 'Enter valid number' : '',
    price: (value) => isNaN(value) || value <= 0 ? 'Enter valid price' : ''
}