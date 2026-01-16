// React Imports
import React, { useState } from 'react'; // Removed useRef as it wasn't used directly for scroll management

// MUI Imports
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Link,
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    ImageList,
    ImageListItem,
    IconButton, // For a potential close button in title
    Stack // For simpler layout in some cases
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // For Dialog Title close button

// Icon Imports
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ImageIcon from '@mui/icons-material/Image';
import LanguageIcon from '@mui/icons-material/Language'; // For Google Maps Link

// Third-party Imports
import classnames from 'classnames'; // Keep if you use it elsewhere, not strictly needed in this version

const TempleDataModal = ({ setOpen, open, templeDetails }) => {
    const [scroll, setScroll] = useState('paper');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // xs, sm
    const isTablet = useMediaQuery(theme.breakpoints.down('md')); // md

    const handleClose = () => setOpen(false);

    // Robust data checking
    
    const {
        name,
        image,
        about,
        location,
        timings,
        social_links,
        gallery_images,
        additional_info,
        contact_number,
        donation,
        createdAt,
        updatedAt,
        user_id,
    } = templeDetails;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString(undefined, { // Use browser's locale
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const SectionCard = ({ title, icon, children, ...props }) => (
        <Grid item xs={12} {...props}>
            <Card elevation={3} sx={{ height: '100%' }}> {/* Ensure cards in a row have same height if needed */}
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.secondary.main, mb: 2 }}>
                        {icon && React.cloneElement(icon, { sx: { mr: 1.5 } })} {title}
                    </Typography>
                    {children}
                </CardContent>
            </Card>
        </Grid>
    );


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="temple-details-title"
            aria-describedby="temple-details-description"
            closeAfterTransition={true} // Smoother transition
            fullScreen={isTablet} // Full screen on tablets and smaller
            PaperProps={{
                sx: {
                    width: isTablet ? '100%' : 'clamp(600px, 85vw, 1200px)', // Responsive width with min/max
                    maxWidth: isTablet ? '100%' : '1200px',
                    maxHeight: isTablet ? '100%' : '90vh', // Max height for non-fullscreen
                    
                    m: 0,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <DialogTitle
                id="temple-details-title"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    textAlign: 'center',
                    py: 1.5,
                    px: 2,
                    fontSize: isMobile ? '1.2rem' : '1.5rem',
                    position: 'relative', // For close button positioning
                }}
            >
                {name || 'Temple Details'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: theme.spacing(1),
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.palette.primary.contrastText,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers={scroll === 'paper'}
                sx={{
                    p: { xs: theme.spacing(2), sm: theme.spacing(3) },
                    backgroundColor: theme.palette.background.default, // Use theme background
                    flexGrow: 1, // Allow content to take available space
                }}
                id="temple-details-description"
            >
                <Grid container spacing={isMobile ? 2 : 3}>
                    {/* Main Image and About Section */}
                    <Grid item xs={12}>
                        <Card elevation={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                            {image && (
                                <CardMedia
                                    component="img"
                                    image={image}
                                    alt={`Image of ${name}`}
                                    sx={{
                                        width: { xs: '100%', md: 300, lg: 200 },
                                        height: { xs: 200, sm: 250, md: 'auto' }, // Auto height on larger screens to maintain aspect ratio
                                        objectFit: 'cover',
                                        aspectRatio: { md: '3/4' } // Maintain aspect ratio for a consistent look
                                    }}
                                />
                            )}
                            <CardContent sx={{ flex: 1, p: theme.spacing(3) }}>
                                <Typography variant={isMobile ? "h6" : "h5"} component="div" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                                    About {name}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph sx={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
                                    {about || 'No detailed information available.'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Location Details */}
                    <SectionCard title="Location" icon={<LocationOnIcon />} md={6}>
                        <Typography variant="body2" paragraph>
                            <strong>Address:</strong> {`${location?.area || ''}${location?.area && (location?.city?.name || location?.state?.name) ? ', ' : ''}${location?.city?.name || ''}${location?.city?.name && location?.state?.name ? ', ' : ''}${location?.state?.name || ''}${location?.state?.name && location?.country?.name ? ', ' : ''}${location?.country?.name || ''}` || 'N/A'}
                        </Typography>
                        
                        {(location?.latitude || location?.longitude) &&
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>Coordinates:</strong> {location?.latitude || 'N/A'}, {location?.longitude || 'N/A'}
                            </Typography>
                        }
                        {location?.google_map_url && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<LanguageIcon />}
                                href={location.google_map_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ mt: 2 }}
                                size="small"
                            >
                                View on Google Maps
                            </Button>
                        )}
                    </SectionCard>

                    {/* Contact Information */}
                    <SectionCard title="Contact" icon={<PhoneIcon />} md={6}>
                        <Typography variant="body1" gutterBottom>
                            <strong>Phone:</strong> {contact_number ? <Link href={`tel:${contact_number}`}>{contact_number}</Link> : 'N/A'}
                        </Typography>
                        {user_id && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Submitted By:</Typography>
                                <Typography variant="body2"><strong>Email:</strong> {user_id.email ? <Link href={`mailto:${user_id.email}`}>{user_id.email}</Link> : 'N/A'}</Typography>
                                <Typography variant="body2"><strong>Phone:</strong> {user_id.phone ? <Link href={`tel:${user_id.phone}`}>{user_id.phone}</Link> : 'N/A'}</Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                                    <Chip label={`Email ${user_id.emailVerified ? 'Verified' : 'Unverified'}`} color={user_id.emailVerified ? "success" : "warning"} size="small" variant="outlined" />
                                    <Chip label={`Phone ${user_id.phoneVerified ? 'Verified' : 'Unverified'}`} color={user_id.phoneVerified ? "success" : "warning"} size="small" variant="outlined" />
                                    <Chip label={`Status: ${user_id.status}`} size="small" color={'info'} variant="outlined" />
                                </Stack>
                            </>
                        )}
                    </SectionCard>

                    {/* Timings */}
                    {(timings?.darshan?.length > 0 || timings?.aarti?.length > 0) && (
                        <SectionCard title="Timings" icon={<AccessTimeIcon />}>
                            {timings?.darshan?.length > 0 && (
                                <Box mb={timings?.aarti?.length > 0 ? 2.5 : 0}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Darshan Timings</Typography>
                                    <List dense>
                                        {timings.darshan.map((item) => (
                                            <ListItem key={item._id} disableGutters sx={{ pl: 1 }}>
                                                <ListItemIcon sx={{ minWidth: theme.spacing(4) }}><EventIcon color="action" fontSize="small" /></ListItemIcon>
                                                <ListItemText primary={item.title} secondary={`${item.start || 'N/A'} - ${item.end || 'N/A'}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                            {timings?.aarti?.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Aarti Timings</Typography>
                                    <List dense>
                                        {timings.aarti.map((item) => (
                                            <ListItem key={item._id} disableGutters sx={{ pl: 1 }}>
                                                <ListItemIcon sx={{ minWidth: theme.spacing(4) }}><EventIcon color="action" fontSize="small" /></ListItemIcon>
                                                <ListItemText primary={item.title} secondary={`${item.start || 'N/A'} - ${item.end || 'N/A'}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </SectionCard>
                    )}

                    {/* Additional Information */}
                    {additional_info && additional_info.length > 0 && (
                        <SectionCard title="Additional Information" icon={<InfoIcon />}>
                            <List sx={{py:0}}>
                                {additional_info.map((info, index) => (
                                    <React.Fragment key={info._id}>
                                        <ListItem sx={{ display: 'block', px:0, py: 1.5 }}>
                                            <Typography variant="subtitle1" component="div" gutterBottom sx={{ fontWeight: 'medium' }}>{info.title}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{info.content}</Typography>
                                        </ListItem>
                                        {index < additional_info.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </SectionCard>
                    )}

                    {/* Gallery Images */}
                    {(gallery_images?.banner?.length > 0 || gallery_images?.gallery?.length > 0) && (
                        <SectionCard title="Gallery" icon={<ImageIcon />}>
                            {gallery_images?.banner?.length > 0 && (
                                <Box mb={3}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Banner Images</Typography>
                                    <ImageList variant="quilted" cols={isMobile ? 2 : (isTablet ? 3 : 4)} gap={8} rowHeight={isMobile ? 200 : 250}>
                                        {gallery_images.banner.map((imgUrl, index) => (
                                            <ImageListItem key={`banner-${imgUrl}-${index}`} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                                <img
                                                    srcSet={`${imgUrl}?w=180&h=180&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${imgUrl}?w=180&h=180&fit=crop&auto=format`}
                                                    alt={`Banner ${index + 1} for ${name}`}
                                                    loading="lazy"
                                                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </Box>
                            )}
                            {gallery_images?.gallery?.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>More Images</Typography>
                                    <ImageList variant="masonry" cols={isMobile ? 2 : (isTablet ? 3 : 4)} gap={8}>
                                        {gallery_images.gallery.map((imgUrl, index) => (
                                            <ImageListItem key={`gallery-${imgUrl}-${index}`} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                                <img
                                                    srcSet={`${imgUrl}?w=180&h=180&fit=crop&auto=format&dpr=2 2x`}
                                                    src={`${imgUrl}?w=180&h=180&fit=crop&auto=format`}
                                                    alt={`Gallery image ${index + 1} for ${name}`}
                                                    loading="lazy"
                                                    style={{ display: 'block', width: '100%', height: 'auto' }}
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </Box>
                            )}
                            {(gallery_images?.banner?.length === 0 && gallery_images?.gallery?.length === 0) && (
                                <Typography variant="body2" color="text.secondary">No images available in the gallery.</Typography>
                            )}
                        </SectionCard>
                    )}

                    {/* Donation Section */}
                    {donation && donation.length > 0 && (
                        <SectionCard title="Donations" icon={<AccountBalanceWalletIcon />}>
                            <Stack spacing={2}>
                                {donation.map((item) => (
                                    <Paper key={item._id} elevation={0} variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: {xs: 'flex-start', sm: 'center'}, gap: 2, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[50] }}>
                                        {item.image && (
                                            <Avatar
                                                src={item.image}
                                                alt={item.button_text || 'Donation Visual'}
                                                sx={{ width: { xs: '100%', sm: 80 }, height: { xs: 120, sm: 80 }, mr: { sm: 2 }, mb: { xs: 1.5, sm: 0 }, borderRadius: 1, objectFit: 'contain' }}
                                                variant="rounded"
                                            />
                                        )}
                                        <Box flexGrow={1}>
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }} gutterBottom>{item.description || "Support Us"}</Typography>
                                            {item.button_text && item.button_link && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    href={item.button_link.startsWith('http') ? item.button_link : `http://${item.button_link}`} // Ensure URL has protocol
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {item.button_text}
                                                </Button>
                                            )}
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        </SectionCard>
                    )}

                    {/* Social Links */}
                    {social_links && Object.values(social_links).filter(Boolean).length > 0 && (
                         <SectionCard title="Social accounts" icon={<LanguageIcon />}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: theme.spacing(isMobile ? 1.5 : 2), flexWrap: 'wrap' }}>
                                {social_links.facebook && (
                                    <IconButton component={Link} href={social_links.facebook.startsWith('http') ? social_links.facebook : `https://${social_links.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" sx={{ color: '#3b5998', '&:hover': { bgcolor: 'rgba(59, 89, 152, 0.1)' } }}>
                                        <FacebookIcon fontSize="large" /> <Typography variant="body2" sx={{ ml: 1 }}>{social_links.facebook}</Typography>
                                    </IconButton>
                                )}
                                {social_links.instagram && (
                                    <IconButton component={Link} href={social_links.instagram.startsWith('http') ? social_links.instagram : `https://${social_links.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram" sx={{ color: '#E1306C', '&:hover': { bgcolor: 'rgba(225, 48, 108, 0.1)' } }}>
                                        <InstagramIcon fontSize="large" /> <Typography variant="body2" sx={{ ml: 1 }}>{social_links.instagram}</Typography>
                                    </IconButton>
                                )}
                                {social_links.youtube && (
                                    <IconButton component={Link} href={social_links.youtube.startsWith('http') ? social_links.youtube : `https://${social_links.youtube}`} target="_blank" rel="noopener noreferrer" aria-label="YouTube" sx={{ color: '#FF0000', '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.1)' } }}>
                                        <YouTubeIcon fontSize="large" /> <Typography variant="body2" sx={{ ml: 1 }}>{social_links.youtube}</Typography>
                                    </IconButton>
                                )}
                                {social_links.linkedIn && (
                                    <IconButton component={Link} href={social_links.linkedIn.startsWith('http') ? social_links.linkedIn : `https://${social_links.linkedIn}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" sx={{ color: '#0077b5', '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' } }}>
                                        <LinkedInIcon fontSize="large" /> <Typography variant="body2" sx={{ ml: 1 }}>{social_links.linkedIn}</Typography>
                                    </IconButton>
                                )}
                            </Box>
                        </SectionCard>
                    )}

                    {/* Meta Information */}
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2 }}>
                            <Typography variant="caption" display="block" gutterBottom>
                                <strong>Created Date:</strong> {formatDate(createdAt)}
                            </Typography>
                            <Typography variant="caption" display="block">
                                <strong>Last Updated:</strong> {formatDate(updatedAt)}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions
                sx={{
                    p: { xs: theme.spacing(1.5), sm: theme.spacing(2) },
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Button onClick={handleClose} variant="contained" color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TempleDataModal;
