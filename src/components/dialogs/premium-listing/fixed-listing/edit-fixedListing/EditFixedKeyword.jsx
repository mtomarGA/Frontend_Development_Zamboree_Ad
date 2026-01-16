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
import Keywords from "@/services/keywords/createKeywordService"
import { Grid } from '@mui/system';

const EditKeywordManager = ({ businessKeyword, handleKeyword, keywords, handleNextClick, data, handlePreviousClick }) => {

 

  const [localBusinessKeyword, setLocalBusinessKeyword] = useState([]);
  const [allKeyword, setAllKeywordRaw] = useState([]);
  const [localAllKeyword, setLocalAllKeyword] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [addedKeywords, setAddedKeywords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) setLocalBusinessKeyword(data);
  }, [data]);

  useEffect(() => {
    if (data) {
      const transformed = transformKeywords(data);
      setLocalBusinessKeyword(transformed);
      setAddedKeywords(transformed);
    }
  }, [data]);

  const cleanKeywordName = (name) => {
    try {
      // Attempt to parse if it looks like a JSON string, then extract 'kw' value
      if (name.startsWith('{"kw":"') && name.endsWith('"}')) {
        const parsed = JSON.parse(name);
        return parsed.kw || name; // Return the 'kw' value, or original if parsing fails or 'kw' not found
      }
      return name; // Return original if it's not the specific JSON format
    } catch (e) {
      console.warn("Could not parse keyword name as JSON, using original:", name, e);
      return name;
    }
  };

  const transformKeywords = (rawData) => {
    try {
      if (!rawData) return [];

      if (Array.isArray(rawData) && rawData.every(item => typeof item === 'object' && item.name)) {
        return rawData.map(item => ({
          ...item,
          name: cleanKeywordName(item.name) // Apply cleaning here
        }));
      }

      if (typeof rawData === 'string') {
        return rawData
          .split(/[»‘',"*\]\[\s]+/)
          .filter(word => word.trim().length > 0)
          .map((name, index) => ({
            id: `business-${Date.now()}-${index}`,
            name: cleanKeywordName(name.trim()), // Apply cleaning here
            count: Math.floor(Math.random() * 1000),
            isBusinessKeyword: true
          }));
      }

      if (Array.isArray(rawData)) {
        return rawData.map((item, index) => ({
          id: `business-${Date.now()}-${index}`,
          name: cleanKeywordName(typeof item === 'string' ? item : JSON.stringify(item)), // Apply cleaning here
          count: Math.floor(Math.random() * 1000),
          isBusinessKeyword: true
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
      const response = await Keywords.getKeyword();
      setAllKeywordRaw(response?.data || []);
    } catch (err) {
      console.error("Error fetching keywords:", err);
      setError("Failed to fetch keywords");
    }
  };

  useEffect(() => {
    fetchAllKeywords();
  }, []);

  const transformAllKeywords = (rawData) => {
    const transformed = transformKeywords(rawData);
    return transformed.map((item, index) => ({
      ...item,
      id: (item.id || `temp-${Date.now()}-${index}`).replace('business-', 'all-'),
      isBusinessKeyword: false
    }));
  };

  useEffect(() => {
    const loadKeywords = async () => {
      try {
        setLoading(true);
        const transformedBusiness = transformKeywords(data);
        const transformedAll = transformAllKeywords(allKeyword);
        setLocalBusinessKeyword(transformedBusiness);
        setLocalAllKeyword(transformedAll);
        setError(null);
      } catch (err) {
        console.error('Error loading keywords:', err);
        setError('Failed to load keywords');
      } finally {
        setLoading(false);
      }
    };

    loadKeywords();
  }, [businessKeyword, allKeyword]);

  const handleKeywordToggle = (keyword) => {
    setSelectedKeywords(prev =>
      prev.some(k => k.id === keyword.id)
        ? prev.filter(k => k.id !== keyword.id)
        : [...prev, keyword]
    );
  };

  const handleAddKeywords = () => {
    let newKeywordCandidates = [...selectedKeywords];

    // REMOVED: The logic that automatically adds the searchTerm if it's new.
    // This ensures only explicitly selected keywords are added.

    setAddedKeywords(prev => [
      ...prev,
      ...newKeywordCandidates.filter(
        selected =>
          !prev.some(
            added =>
              (added._id && selected._id && added._id === selected._id) ||
              added.id === selected.id ||
              added.name.toLowerCase() === selected.name.toLowerCase()
          )
      )
    ]);

    setSelectedKeywords([]);
    // setSearchTerm(''); // You can keep or remove this line depending on whether you want to clear the search input after adding.
  };
  const handleSave = () => {
    // Only pass the keyword names to the handleKeyword function
    const keywordNamesToSave = addedKeywords.map(keyword => keyword.name);
    handleKeyword(keywordNamesToSave);
  };

  const handleSaveAndNext = (e) => {
    handleSave();
    handleNextClick(e);
  };

  const handleRemoveKeyword = (keyword) => {
    setAddedKeywords(prev => prev.filter(k => k.id !== keyword.id));
    setSelectedKeywords(prev => prev.filter(k => k.id !== keyword.id)); // Also remove from selected if it was there
  };

  const filteredKeywords = useMemo(() => {
    const businessKeywordsToShow = localBusinessKeyword;

    if (!searchTerm) {
      // If no search term, only show business keywords
      return businessKeywordsToShow;
    }

    // Filter localAllKeyword (which includes keywords from the API)
    // and exclude those that are already in businessKeywordsToShow (to avoid duplicates in display)
    const searchResults = localAllKeyword.filter(keyword =>
      keyword.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !businessKeywordsToShow.some(bk => bk.name.toLowerCase() === keyword.name.toLowerCase())
    );

    // Combine and return. Prioritize showing business keywords first if they match the search.
    // Ensure no duplicates by name (case-insensitive)
    const combined = [...businessKeywordsToShow, ...searchResults];
    const uniqueKeywords = [];
    const seenNames = new Set();

    for (const keyword of combined) {
      const lowerCaseName = keyword.name.toLowerCase();
      if (!seenNames.has(lowerCaseName)) {
        uniqueKeywords.push(keyword);
        seenNames.add(lowerCaseName);
      }
    }
    return uniqueKeywords;
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
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  const handlePriviouse = () => {
    handlePreviousClick();
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <Grid container spacing={3} className='flex flex-col gap-5'>

        {/* Keyword Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Keywords</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>{localBusinessKeyword.length} Business Keywords</strong> • <strong>{localAllKeyword.length} Total Keywords</strong>
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
                          checked={selectedKeywords.some(k => k.id === keyword.id) || addedKeywords.some(k => k.name.toLowerCase() === keyword.name.toLowerCase())}
                          onChange={() => handleKeywordToggle(keyword)}
                          color="primary"
                          // Disable checkbox if the keyword is already in the 'addedKeywords' list
                          disabled={addedKeywords.some(k => k.name.toLowerCase() === keyword.name.toLowerCase())}
                        />
                        <Typography className="flex-grow">
                          {keyword?.name}
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {keyword.isBusinessKeyword ? "Business" : "Other"}
                          </span>
                        </Typography>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="body2" className="italic">
                    {searchTerm ? 'No matching keywords found' : 'No keywords available'}
                  </Typography>
                )}
              </div>

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddKeywords}
                  disabled={selectedKeywords.length === 0 && !searchTerm} // Enable if items are selected or if there's a search term
                >
                  Add Selected ({selectedKeywords.length})
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Added Keywords */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Added Keywords</Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>{addedKeywords.length} Records</strong> selected
              </Typography>

              <Divider className="my-4" />

              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {addedKeywords.length > 0 ? (
                  addedKeywords.map((keyword) => (
                    <div key={keyword.id} className="flex items-center justify-between">
                      <div className='flex gap-3'>
                        <Typography className="truncate">{keyword.name}</Typography>
                        <span className="text-xs text-blue-600">
                          ({keyword.isBusinessKeyword ? "Business" : "Other"})
                        </span>
                      </div>
                      <IconButton size="small" onClick={() => handleRemoveKeyword(keyword)}>
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

export default EditKeywordManager;
