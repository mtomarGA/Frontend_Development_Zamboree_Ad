import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  IconButton,
  Divider,
  Box,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Keywords from "@/services/keywords/createKeywordService";
import { Grid } from '@mui/system';

const KeywordManager = ({ businessKeyword, handleKeyword, keywords, handleNextClick, data, handlePreviousClick }) => {

  const [localBusinessKeyword, setLocalBusinessKeyword] = useState([]);
  const [allKeywordRaw, setAllKeywordRaw] = useState([]); // Renamed for clarity
  const [localAllKeyword, setLocalAllKeyword] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [addedKeywords, setAddedKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform raw keyword data into proper format
  const transformKeywords = (rawData, isBusiness = false) => {
    try {
      if (!rawData) return [];

      // If already in correct format and has a 'name' property
      if (Array.isArray(rawData) && rawData.every(item => typeof item === 'object' && item.name !== undefined)) {
        return rawData.map(item => ({
          ...item,
          // Ensure unique ID for consistency, preferring existing _id or id
          id: item._id || item.id || `${isBusiness ? 'business' : 'all'}-${Math.random().toString(36).substr(2, 9)}`,
          isBusinessKeyword: isBusiness // Set based on context
        }));
      }

      // If it's a string
      if (typeof rawData === 'string') {
        return rawData
          .split(/[,;»‘"*[\]\s]+/) // More comprehensive delimiters
          .filter(word => word.trim().length > 0)
          .map((name, index) => ({
            id: `${isBusiness ? 'business' : 'temp'}-${index + 1}-${Math.random().toString(36).substr(2, 5)}`,
            name: name.trim(),
            count: Math.floor(Math.random() * 1000), // Random count for demonstration
            isBusinessKeyword: isBusiness
          }));
      }

      // If array of strings or mixed types
      if (Array.isArray(rawData)) {
        return rawData.map((item, index) => ({
          id: `${isBusiness ? 'business' : 'temp'}-${index + 1}-${Math.random().toString(36).substr(2, 5)}`,
          name: typeof item === 'string' ? item : JSON.stringify(item),
          count: Math.floor(Math.random() * 1000),
          isBusinessKeyword: isBusiness
        }));
      }

      return [];
    } catch (err) {
      console.error('Error transforming keywords:', err);
      setError('Failed to process keywords data');
      return [];
    }
  };

  const fetchAllKeywords = async () => {
    try {
      setLoading(true);
      const response = await Keywords.getKeyword();
      setAllKeywordRaw(response?.data || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching keywords:", err);
      setError("Failed to fetch keywords from API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllKeywords();
  }, []);

  // Effect to load and transform keywords when businessKeyword or allKeywordRaw changes
  useEffect(() => {
    setLoading(true); // Set loading true while processing
    const transformedBusiness = transformKeywords(businessKeyword, true);
    // Transform all keywords, ensuring they are not marked as business keywords by default here
    const transformedAll = transformKeywords(allKeywordRaw, false);

    setLocalBusinessKeyword(transformedBusiness);
    setLocalAllKeyword(transformedAll);

    
    if (!data) {
        setAddedKeywords(transformedBusiness);
    }

    setLoading(false);
  }, [businessKeyword, allKeywordRaw]);


  // Run this when props.data changes to initialize or update addedKeywords
  useEffect(() => {
    if (data) {
      const transformedDataKeywords = transformKeywords(data, true); // Assuming data implies business keywords
      setLocalBusinessKeyword(transformedDataKeywords); // Update business keywords based on data
      setAddedKeywords(transformedDataKeywords);
    }
  }, [data]);


  const handleKeywordToggle = (keyword) => {
    setSelectedKeywords(prev =>
      prev.some(k => k.id === keyword.id)
        ? prev.filter(k => k.id !== keyword.id)
        : [...prev, keyword]
    );
  };

  const handleAddKeywords = () => {
    setAddedKeywords(prev => {
      const newKeywords = selectedKeywords.filter(
        selected =>
          // Check if no keyword in 'prev' has the same ID OR the same name (case-insensitive)
          !prev.some(added => added.id === selected.id || added.name.toLowerCase() === selected.name.toLowerCase())
      );
      return [...prev, ...newKeywords];
    });
    setSelectedKeywords([]);
  };

  const handleSave = () => {
    handleKeyword(addedKeywords);
  };

  const handleSaveAndNext = () => {
    handleSave(); // Save first
    handleNextClick(); // Then go to next
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setAddedKeywords(prev => prev.filter(keyword => keyword.id !== keywordToRemove.id));
  };

  const handlePriviouse = () => {
    handlePreviousClick();
  };


  // Combine business keywords with search results from all keywords
  const filteredKeywords = useMemo(() => {
    const businessKeywordsToShow = localBusinessKeyword;

    if (!searchTerm) {
      return businessKeywordsToShow;
    }

    const searchResults = localAllKeyword.filter(keyword =>
      keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      // Ensure search results don't duplicate existing business keywords by name
      !businessKeywordsToShow.some(bk => bk.name.toLowerCase() === keyword.name.toLowerCase())
    );

    return [...businessKeywordsToShow, ...searchResults];
  }, [searchTerm, localBusinessKeyword, localAllKeyword]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading keywords...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <Grid container spacing={3} className='flex flex-col gap-5'>
        {/* Available Keywords Card */}
        <Grid item xs={12} md={12}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom className="font-bold">
                Keywords
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>{localBusinessKeyword.length} Business Keywords</strong> (always shown) •{' '}
                <strong>{localAllKeyword.length} Total Keywords</strong> available
              </Typography>

              <TextField
                label="Search All Keywords"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="my-4"
              />

              <Divider className="mb-4" />

              <div className="max-h-96 overflow-y-auto">
                {filteredKeywords.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredKeywords.map((keyword) => (
                      <div key={keyword.id} className="flex items-start">
                        <Checkbox
                          checked={selectedKeywords.some(k => k.id === keyword.id)}
                          onChange={() => handleKeywordToggle(keyword)}
                          color="primary"
                        />
                        <Typography className="flex-grow">
                          {keyword?.name}
                          {keyword.isBusinessKeyword ? (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Business
                            </span>
                          ) : <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Other</span>}
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" color="textSecondary" className="italic">
                    {searchTerm ? 'No matching keywords found' : 'No keywords available'}
                  </Typography>
                )}
              </div>

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddKeywords}
                  disabled={selectedKeywords.length === 0}
                >
                  Add Selected ({selectedKeywords.length})
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Added Keywords Card */}
        <Grid item xs={12} md={12}>
          <Card className="shadow-sm h-full">
            <CardContent className="h-full flex flex-col">
              <Typography variant="h6" component="h2" gutterBottom className="font-bold">
                Added Keywords
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>{addedKeywords.length} Records</strong> selected
              </Typography>

              <Divider className="my-4" />

              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {addedKeywords.length > 0 ? (
                  addedKeywords?.map((keyword) => (
                    <div key={keyword.id} className="flex items-center justify-between">
                      <div className='flex gap-3'>
                        <Typography className="truncate">{keyword.name}</Typography>
                        {keyword.isBusinessKeyword ? (
                          <span className="text-xs text-blue-600">(Business)</span>
                        ) : <span className="text-xs text-gray-600">(Other)</span>}
                      </div>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="italic col-span-2"
                  >
                    No keywords added yet.
                  </Typography>
                )}
              </div>

              <Box mt={2}>
                <Typography variant="caption" color="textSecondary" className="block">
                  Note: Business keywords are marked in blue
                </Typography>

                <Divider className="my-4" />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Button variant="outlined" onClick={handlePriviouse}>
                    Previous
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSaveAndNext}
                    disabled={addedKeywords.length === 0}
                  >
                    Save & Next
                  </Button>

                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default KeywordManager;
