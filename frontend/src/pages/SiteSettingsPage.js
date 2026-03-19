import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Form, Button, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import Message from '../components/Message'
import { checkTokenValidation, logout } from '../actions/userActions'
import { defaultSiteSettings } from '../utils/defaultSiteSettings'

function SiteSettingsPage() {
    const history = useHistory()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState(defaultSiteSettings)
    const [heroImage, setHeroImage] = useState(null)
    const [promoImage, setPromoImage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const userLoginReducer = useSelector((state) => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const checkTokenValidationReducer = useSelector((state) => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo || !userInfo.admin) {
            history.push('/login')
            return
        }

        dispatch(checkTokenValidation())

        const loadSettings = async () => {
            try {
                const { data } = await axios.get('/api/site-settings/')
                setFormData((current) => ({ ...current, ...data }))
            } catch (err) {
                setError('Unable to load site settings right now.')
            } finally {
                setLoading(false)
            }
        }

        loadSettings()
    }, [dispatch, history, userInfo])

    if (userInfo && tokenError === 'Request failed with status code 401') {
        alert('Session expired, please login again.')
        dispatch(logout())
        history.push('/login')
        window.location.reload()
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        setError('')
        setSuccessMessage('')

        try {
            const payload = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (!['hero_background_image', 'promo_background_image'].includes(key)) {
                    payload.append(key, value || '')
                }
            })

            if (heroImage) {
                payload.append('hero_background_image', heroImage)
            }
            if (promoImage) {
                payload.append('promo_background_image', promoImage)
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }

            const { data } = await axios.put('/api/site-settings/', payload, config)
            setFormData((current) => ({ ...current, ...data }))
            setHeroImage(null)
            setPromoImage(null)
            setSuccessMessage('Site settings updated successfully.')
        } catch (err) {
            setError(err.response?.data?.detail ? JSON.stringify(err.response.data.detail) : 'Failed to save site settings.')
        } finally {
            setSaving(false)
        }
    }

    const heroPreview = heroImage ? URL.createObjectURL(heroImage) : formData.hero_background_image
    const promoPreview = promoImage ? URL.createObjectURL(promoImage) : formData.promo_background_image

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '980px' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div className="section-eyebrow">Admin</div>
                    <h1 style={{ margin: 0 }}>Site Settings</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                        Manage your website name, homepage copy, support details, and background images here.
                        Product images are uploaded on each product create/edit screen.
                    </p>
                </div>

                {error && <Message variant="danger">{error}</Message>}
                {successMessage && <Message variant="success">{successMessage}</Message>}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Spinner animation="border" style={{ color: 'var(--accent)' }} />
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <div className="content-card">
                            <div className="content-card-header">
                                <h3 style={{ margin: 0 }}>Branding</h3>
                            </div>

                            <Form.Group controlId="site_name" style={{ marginBottom: '1rem' }}>
                                <Form.Label>Website Name</Form.Label>
                                <Form.Control name="site_name" value={formData.site_name} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="hero_eyebrow" style={{ marginBottom: '1rem' }}>
                                <Form.Label>Homepage Eyebrow</Form.Label>
                                <Form.Control name="hero_eyebrow" value={formData.hero_eyebrow} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="hero_title" style={{ marginBottom: '1rem' }}>
                                <Form.Label>Homepage Title</Form.Label>
                                <Form.Control name="hero_title" value={formData.hero_title} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="hero_subtitle">
                                <Form.Label>Homepage Subtitle</Form.Label>
                                <Form.Control as="textarea" rows={3} name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} />
                            </Form.Group>
                        </div>

                        <div className="content-card">
                            <div className="content-card-header">
                                <h3 style={{ margin: 0 }}>Support Details</h3>
                            </div>

                            <Form.Group controlId="support_email" style={{ marginBottom: '1rem' }}>
                                <Form.Label>Support Email</Form.Label>
                                <Form.Control type="email" name="support_email" value={formData.support_email} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="support_phone" style={{ marginBottom: '1rem' }}>
                                <Form.Label>Support Phone</Form.Label>
                                <Form.Control name="support_phone" value={formData.support_phone} onChange={handleChange} />
                            </Form.Group>

                            <Form.Group controlId="footer_address">
                                <Form.Label>Footer Address</Form.Label>
                                <Form.Control name="footer_address" value={formData.footer_address} onChange={handleChange} />
                            </Form.Group>
                        </div>

                        <div className="content-card">
                            <div className="content-card-header">
                                <h3 style={{ margin: 0 }}>Images</h3>
                            </div>

                            <Form.Group controlId="hero_background_image" style={{ marginBottom: '1.5rem' }}>
                                <Form.Label>Homepage Hero Background</Form.Label>
                                <Form.Control type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setHeroImage(event.target.files[0] || null)} />
                                {heroPreview && (
                                    <img src={heroPreview} alt="Hero background preview" style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: 'var(--radius)', marginTop: '1rem' }} />
                                )}
                            </Form.Group>

                            <Form.Group controlId="promo_background_image">
                                <Form.Label>Secondary Promo Background</Form.Label>
                                <Form.Control type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => setPromoImage(event.target.files[0] || null)} />
                                {promoPreview && (
                                    <img src={promoPreview} alt="Promo background preview" style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: 'var(--radius)', marginTop: '1rem' }} />
                                )}
                            </Form.Group>
                        </div>

                        <div className="content-card">
                            <div className="content-card-header">
                                <h3 style={{ margin: 0 }}>Product Media</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Product images are managed per product. Create a new product or open an existing one and use its image upload field.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <Link to="/new-product/" className="btn-atelier">Add Product</Link>
                                <Link to="/all-orders/" className="btn-atelier-outline">Orders Dashboard</Link>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem' }}>
                            <Button type="submit" variant="primary" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Site Settings'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => history.push('/account')}>
                                Back to Account
                            </Button>
                        </div>
                    </Form>
                )}
            </div>
        </div>
    )
}

export default SiteSettingsPage