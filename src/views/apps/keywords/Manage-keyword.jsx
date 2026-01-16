'use client';

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import {
  Card,
  Button,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import DialogCloseButton from '@/components/dialogs/DialogCloseButton';
import CustomTextField from '@core/components/mui/TextField';
import ManageKeywordTable from '@/components/keyword/manage-keyword-table';
import Category from '@/services/category/category.service';
import SubCategory from '@/services/category/subCategory.service';
import KeywordService from '@/services/keywords/createKeywordService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

// --- Start of AI API Integration ---
// Using the environment variable name you specified
const GEMINI_API_KEY = "AIzaSyCz6GT-wec3m3WeTEMLRTF3uLN4dQ1NMKM";

const generateKeywordsFromAI = async (categoryName, subcategoryName, userPrompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key (NEXT_PUBLIC_GENERATE_KEYWORD) is not configured. Please check your .env.local file.');
  }
  if (!categoryName || !subcategoryName) {
    throw new Error('Category and Subcategory are required for AI keyword generation.');
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


  const defaultPrompt = `Generate 11–21 more relevant keywords for the category "${categoryName}" and subcategory "${subcategoryName}". Each keyword should be 2 to 4 words long and comma-separated. Focus on commonly searched terms, related concepts, and close variations. Exclude any special characters)`;

  const userPrompts = `Generate 11–21 more relevant keywords for the category "${categoryName}", subcategory "${subcategoryName}", and based on the user input "${userPrompt}". Each keyword should be 3 to 4 words long and comma-separated. Focus on commonly searched terms, related concepts, and close variations. Exclude any special characters.`;



  const finalPrompt = userPrompts && userPrompts.trim() !== ''
    ? userPrompts
    : defaultPrompt;

  try {
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    const keywords = text
      .split(',')
      .map((keyword) => keyword.trim())
      .filter((keyword) => {
        const cleaned = keyword.replace(/["*]/g, ''); // Remove specified special characters
        return cleaned.length > 0; // Keep only non-empty strings
      })
      .map((keyword) => keyword.replace(/["*]/g, ''))
      .filter((keyword) => keyword.length > 0); // Filter again for any strings that became empty after the second map
    if (keywords.length > 7) {
      return keywords.slice(0, 15);
    }

    return keywords;
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.errorInfo && error.response.errorInfo.reason === 'API_KEY_INVALID') {
      toast.error('API key not valid. Please check your API key configuration.');
    } else if (error.response && error.response.status === 503) {
      toast.error('The AI model is currently overloaded. Please try again later.');
    } else if (error.message.includes('API Key (NEXT_PUBLIC_GENERATE_KEYWORD) is not configured')) {
      toast.error(error.message); // Specific error for missing API key
    }
    else {
      toast.error('Failed to generate keywords via AI. Please check console for details.');
    }
    return [];
  }
};
// --- End of AI API Integration ---

const ManageKeyword = () => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    name: [], // 'name' holds the keywords
    userPrompt: '', // State to hold the user's custom prompt
  });
  const { hasPermission } = useAuth();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [getkeyword, setgetkeyword] = useState();

  const [loading, setLoading] = useState(false);
  const [openGenderModal, setOpenGenderModal] = useState(false);

  const [errors, setErrors] = useState({
    category: '',
    subcategory: '',
    name: '',
    userPrompt: '', // Error state for user prompt
  });

  const handleKeywordDelete = (keywordToDelete) => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name.filter((k) => k !== keywordToDelete),
    }));
  };

  const getKeywords = async () => {
    const results = await KeywordService.getKeyword();
    setgetkeyword(results.data);
  };

  useEffect(() => {
    getKeywords();
  }, []);

  const handleSave = async () => {
    const newErrors = {
      category: formData.category ? '' : 'Category is required',
      subcategory: formData.subcategory ? '' : 'Subcategory is required',
      name: formData.name.length > 0 ? '' : 'At least one keyword is required',
      userPrompt: '', // No specific validation for prompt on save unless you want to make it required
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((error) => error !== '');
    if (hasError) return;

  
    setLoading(true);
    try {
      const result = await KeywordService.addKeyword(formData);
      getKeywords();
      toast.success(result.message);
      setOpenGenderModal(false);
      // Reset form data after successful save
      setFormData({
        category: '',
        subcategory: '',
        name: [],
        userPrompt: '', // Reset user prompt as well
      });
    } catch (error) {
      toast.error('Failed to save keywords.');
      console.error('Error saving keywords:', error);
    } 
  };

  const getCategories = async () => {
    const result = await Category.getCategories();
    setCategories(result.data);
  };

  const getSubCategories = async (id) => {
    const result = await SubCategory.getByCategoryId(id);
    setSubCategories(result.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleGenerateViaAI = async () => {
    // Get selected category and subcategory names
    const selectedCategory = categories.find((cat) => cat._id === formData.category);
    const selectedSubcategory = subCategories.find((subCat) => subCat._id === formData.subcategory);

    if (!selectedCategory || !selectedSubcategory) {
      toast.error('Please select both a Category and a Subcategory first.');
      return;
    }

    setLoading(true);
    
      // Pass the userPrompt to the generation function
      const generatedKeywords = await generateKeywordsFromAI(
        selectedCategory.name,
        selectedSubcategory.name,
        formData.userPrompt // Pass the user's prompt here
      );
      setFormData((prev) => ({
        ...prev,
        name: [...new Set([...prev.name, ...generatedKeywords])], // Add new keywords, avoiding duplicates
      }));
      if (generatedKeywords.length > 0) {
        toast.success('Keywords generated successfully via AI!');
      } else {
        toast.info('AI did not generate any keywords based on your prompt or the API returned no results.');
      }
    
  };

  return (
    <Card>
      <CardContent>
       
      </CardContent>
      <ManageKeywordTable datas={getkeyword} onSuccess={getKeywords} getKeywords={getKeywords} />
    </Card>
  );
};

export default ManageKeyword;
