'use client'
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  TextField,
  Typography,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useUpdateListingFormContext } from '@/hooks/updateListingForm';
import serviceCategoryService from '@/services/business/service/serviceCategory.service';

const KeywordManager = ({ nextHandle }) => {
  const {
    keywordsFormData,
    keywordsErrors,
    handleKeywordsChange,
    validateKeywords,
    companyFormData
  } = useUpdateListingFormContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Search keywords by category and search term
  const searchKeywords = async () => {
    if (!companyFormData?.businessCategory) {
      setError('Business category not selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await serviceCategoryService.getAttributeBySearch(
        companyFormData.businessCategory,
        searchTerm.trim()
      );

      if (response?.data) {
        // If API returns object: { name, parent, keywords }
        if (Array.isArray(response.data)) {
          setFilteredKeywords(response.data);
        } else {
          setFilteredKeywords(response.data.keywords || []);
          setCategoryInfo({
            name: response.data.name,
            parent: response.data.parent
          });
        }
      } else {
        setError('No results found');
        setFilteredKeywords([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search keywords');
      setFilteredKeywords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search when typing
  useEffect(() => {
    if (!searchTerm) return;
    const delayDebounce = setTimeout(() => {
      searchKeywords();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleToggleKeyword = (keyword) => {
    const currentKeywords = keywordsFormData.keywords || [];
    const newKeywords = currentKeywords.includes(keyword)
      ? currentKeywords.filter(k => k !== keyword)
      : [...currentKeywords, keyword];
    handleKeywordsChange('keywords', newKeywords);
  };

  const handleRemoveKeyword = (keyword) => {
    handleKeywordsChange(
      'keywords',
      (keywordsFormData.keywords || []).filter(k => k !== keyword)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateKeywords()) {
      nextHandle();
    }
  };

  // Initialize with already selected keywords when component mounts
  useEffect(() => {
    if (keywordsFormData.keywords?.length > 0) {
      setFilteredKeywords(keywordsFormData.keywords);
    }
  }, []);

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Keyword Management
        </Typography>

        {/* Category Info */}
        {categoryInfo && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle2">
              Current Category: {categoryInfo.name}
            </Typography>
            {categoryInfo.parent && (
              <Typography variant="body2" color="text.secondary">
                Parent: {categoryInfo.parent.name}
              </Typography>
            )}
          </Box>
        )}

        {/* Search Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading || !companyFormData?.businessCategory}
          />
        </Box>

        {/* Error Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {keywordsErrors.keywords && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {keywordsErrors.keywords}
          </Typography>
        )}

        <Grid container spacing={3}>
          {/* Available Keywords Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="medium" mb={1}>
              Search Result ({filteredKeywords.length})
            </Typography>
            <Box sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              maxHeight: 300,
              overflow: 'auto',
              p: 1
            }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : filteredKeywords.length > 0 ? (
                <List dense>
                  {filteredKeywords.map((keyword, i) => (
                    <ListItem
                      key={`${keyword}-${i}`}
                      disablePadding
                      onClick={() => handleToggleKeyword(keyword)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={(keywordsFormData.keywords || []).includes(keyword)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleKeyword(keyword);
                            }}
                            color="primary"
                          />
                        }
                        label={keyword}
                        sx={{ width: '100%', px: 1 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ p: 2, textAlign: 'center' }}
                >
                  {searchTerm
                    ? 'No matching keywords found'
                    : 'Available Keywords'}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Selected Keywords Column */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="medium" mb={1}>
              Selected Keywords ({keywordsFormData.keywords?.length || 0})
            </Typography>
            <Box sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              minHeight: 300,
              p: 2
            }}>
              {keywordsFormData.keywords?.length > 0 ? (
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  maxHeight: 280,
                  overflow: 'auto'
                }}>
                  {keywordsFormData.keywords.map((keyword, i) => (
                    <Chip
                      key={`${keyword}-${i}`}
                      label={keyword}
                      onDelete={() => handleRemoveKeyword(keyword)}
                      color="primary"
                      sx={{
                        '& .MuiChip-deleteIcon': {
                          color: 'inherit',
                          fontSize: '1.125rem'
                        }
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  No keywords selected yet
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default KeywordManager;
