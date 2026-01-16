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
import { useAddListingFormContext } from '@/hooks/useAddListingForm';
import serviceCategoryService from '@/services/business/service/serviceCategory.service';

const KeywordManager = ({ nextHandle }) => {
  const {
    keywordsFormData,
    keywordsErrors,
    handleKeywordsChange,
    validateKeywords,
    companyFormData
  } = useAddListingFormContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---- helpers to normalize keyword ----
  const getKeywordId = (keyword) =>
    typeof keyword === 'string' ? keyword : keyword._id;

  const getKeywordLabel = (keyword) =>
    typeof keyword === 'string' ? keyword : keyword.name;

  // ---- API call ----
  const searchKeywords = async (search) => {
    if (!companyFormData?.businessCategory) {
      setError('Business category not selected');
      return;
    }

    if (!search.trim()) {
      setFilteredKeywords([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await serviceCategoryService.getkeywordSearch(search.trim());

      if (response.data && response.data.length > 0) {
        setFilteredKeywords(response.data);
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

  // ---- debounce searchTerm ----
  useEffect(() => {
    if (searchTerm.trim()) {
      const delay = setTimeout(() => {
        searchKeywords(searchTerm);
      }, 500); // wait 500ms after typing
      return () => clearTimeout(delay);
    } else {
      setFilteredKeywords([]);
    }
  }, [searchTerm]);

  // ---- keyword toggle/remove ----
  const handleToggleKeyword = (keyword) => {
    const currentKeywords = keywordsFormData.keywords || [];
    const exists = currentKeywords.some(
      (k) => getKeywordId(k) === getKeywordId(keyword)
    );

    const newKeywords = exists
      ? currentKeywords.filter((k) => getKeywordId(k) !== getKeywordId(keyword))
      : [...currentKeywords, keyword];

    handleKeywordsChange('keywords', newKeywords);
  };

  const handleRemoveKeyword = (keyword, e) => {
    e.stopPropagation();
    handleKeywordsChange(
      'keywords',
      (keywordsFormData.keywords || []).filter(
        (k) => getKeywordId(k) !== getKeywordId(keyword)
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateKeywords()) {
      nextHandle();
    }
  };

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Keyword Management
        </Typography>

        {/* Search Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" fontWeight="medium" mb={1}>
              Available Keywords ({filteredKeywords.length})
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                maxHeight: 300,
                overflow: 'auto',
                p: 1
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : filteredKeywords.length > 0 ? (
                <List dense>
                  {filteredKeywords.map((keyword) => (
                    <ListItem
                      key={getKeywordId(keyword)}
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
                            checked={(keywordsFormData.keywords || []).some(
                              (k) => getKeywordId(k) === getKeywordId(keyword)
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleKeyword(keyword);
                            }}
                            color="primary"
                          />
                        }
                        label={getKeywordLabel(keyword)}
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
                    : 'Related keywords will appear here as you type'}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Selected Keywords Column */}
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" fontWeight="medium" mb={1}>
              Selected Keywords ({keywordsFormData.keywords?.length || 0})
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                minHeight: 300,
                p: 2
              }}
            >
              {keywordsFormData.keywords?.length > 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    maxHeight: 280,
                    overflow: 'auto'
                  }}
                >
                  {keywordsFormData.keywords.map((keyword) => (
                    <Chip
                      key={getKeywordId(keyword)}
                      label={getKeywordLabel(keyword)}
                      onDelete={(e) => handleRemoveKeyword(keyword, e)}
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
