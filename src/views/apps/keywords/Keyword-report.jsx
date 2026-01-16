// "use client";

// import { useEffect, useState } from 'react';
// import Grid from '@mui/material/Grid2';
// import { TextField, Paper, Typography, CardHeader, Button, Card } from '@mui/material';

// import KeywordTable from '@/components/keyword/reportTable/KeywordTable';
// import StateTable from '@/components/keyword/reportTable/StateTable';
// import CityTable from '@/components/keyword/reportTable/CityTable';
// import AreaTables from '@/components/keyword/reportTable/AreaTables';


// //import service keyword

// import kyewordService from '@/services/keywords/createKeywordService'

// export default function KeywordsReportPage() {
//   const [startMonth, setStartMonth] = useState('');
//   const [endMonth, setEndMonth] = useState('');
//   const [startStateMonth, setStartStateMonth] = useState('');
//   const [endStateMonth, setEndStateMonth] = useState('');
//   const [startCityMonth, setStartCityMonth] = useState('');
//   const [endCityMonth, setEndCityMonth] = useState('');
//   const [startAreaMonth, setStartAreaMonth] = useState('');
//   const [endAreaMonth, setEndAreaMonth] = useState('');

//   const [showKeywordTable, setShowKeywordTable] = useState(false);
//   const [showStateSection, setShowStateSection] = useState(false);
//   const [showStateTable, setShowStateTable] = useState(false);
//   const [showCitySection, setShowCitySection] = useState(false);
//   const [showCityTable, setShowCityTable] = useState(false);
//   const [showAreaSection, setShowAreaSection] = useState(false);
//   const [showAreaTable, setShowAreaTable] = useState(false);

//   const [errors, setErrors] = useState({ startMonth: '', endMonth: '' });


//   const getKeyword = async () => {
//     const result = await kyewordService.getKeyword()
//     console.log(result, 'dddddddddddddddddd')
//   }

//   useEffect(() => {
//     getKeyword()
//   }, [])



//   const keywordsData = [
//     { keyword: 'software development company in noida', hits: 2547 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//     { keyword: 'software company in noida', hits: 1247 },
//   ];

//   const keywordDataState = [
//     { state: 'Uttar Pradesh', hits: 255 },
//     { state: 'Bihar', hits: 2555 },
//     { state: 'Delhi', hits: 2555 },
//     { state: 'Delhi', hits: 2555 },
//     { state: 'Delhi', hits: 2555 },
//     { state: 'Delhi', hits: 2555 },
//   ];

//   const keywordDataCity = [
//     { city: 'Noida', hits: 123 },
//     { city: 'Lucknow', hits: 456 },
//     { city: 'Kanpur', hits: 789 },
//   ];

//   const keywordDataArea = [
//     { area: 'Sector 15', hits: 150 },
//     { area: 'Sector 18', hits: 300 },
//     { area: 'Sector 21', hits: 500 },
//   ];

//   const handleSearch = () => {
//     const newErrors = { startMonth: '', endMonth: '' };

//     if (!startMonth) newErrors.startMonth = 'Start month is required';
//     if (!endMonth) newErrors.endMonth = 'End month is required';

//     if (startMonth && endMonth && new Date(startMonth) > new Date(endMonth)) {
//       newErrors.endMonth = 'End month cannot be before start month';
//     }

//     setErrors(newErrors);

//     if (!newErrors.startMonth && !newErrors.endMonth) {
//       console.log('Keyword Search clicked', { startMonth, endMonth });
//       setShowKeywordTable(true);
//     }
//   };

//   const handleStateSearch = () => {
//     const newErrors = { startMonth: '', endMonth: '' };

//     if (!startStateMonth) newErrors.startMonth = 'Start month is required';
//     if (!endStateMonth) newErrors.endMonth = 'End month is required';

//     if (startStateMonth && endStateMonth && new Date(startStateMonth) > new Date(endStateMonth)) {
//       newErrors.endMonth = 'End month cannot be before start month';
//     }

//     setErrors(newErrors);

//     if (!newErrors.startMonth && !newErrors.endMonth) {
//       console.log('State Search clicked', { startStateMonth, endStateMonth });
//       setShowStateTable(true);
//     }
//   };

  // const handleCitySearch = () => {
  //   const newErrors = { startMonth: '', endMonth: '' };

  //   if (!startCityMonth) newErrors.startMonth = 'Start month is required';
  //   if (!endCityMonth) newErrors.endMonth = 'End month is required';

  //   if (startCityMonth && endCityMonth && new Date(startCityMonth) > new Date(endCityMonth)) {
  //     newErrors.endMonth = 'End month cannot be before start month';
  //   }

  //   setErrors(newErrors);

  //   if (!newErrors.startMonth && !newErrors.endMonth) {
  //     console.log('City Search clicked', { startCityMonth, endCityMonth });
  //     setShowCityTable(true);
  //   }
  // };

  // const handleAreaSearch = () => {
  //   const newErrors = { startMonth: '', endMonth: '' };

  //   if (!startAreaMonth) newErrors.startMonth = 'Start month is required';
  //   if (!endAreaMonth) newErrors.endMonth = 'End month is required';

  //   if (startAreaMonth && endAreaMonth && new Date(startAreaMonth) > new Date(endAreaMonth)) {
  //     newErrors.endMonth = 'End month cannot be before start month';
  //   }

  //   setErrors(newErrors);

  //   if (!newErrors.startMonth && !newErrors.endMonth) {
  //     console.log('Area Search clicked', { startAreaMonth, endAreaMonth });
  //     setShowAreaTable(true);
  //   }
  // };

//   const statetrueFalse = () => {
//     setShowStateSection(true);
//     setShowStateTable(false);
//     setShowCitySection(false);
//     setShowCityTable(false);
//     setShowAreaSection(false);
//     setShowAreaTable(false);
//   }

//   const citytrueFalse = () => {
//     setShowCitySection(true);
//     setShowCityTable(false);
//     setShowAreaSection(false);
//     setShowAreaTable(false);
//   }

//   const AreaTrueFalse = () => {
//     setShowAreaSection(true);
//     setShowAreaTable(false);
//   }

//   return (
//     <Grid container spacing={2} className=" w-full ">
//       {/* Header */}
//       <Grid size={{ xs: 12 }}>
//         <Paper elevation={2}>
//           <CardHeader title="Keywords Report" />
//         </Paper>
//       </Grid>

//       {/* Filters */}
//       <Card className="py-8 w-full shadow-none  p-4 rounded-md">
//         <Grid size={{ xs: 12 }}  >
//           <Grid container spacing={2} className="mb-6">
//             <Grid item xs={12} sm={6} md={3}>
//               <Typography variant="body2" className="mb-1 font-medium">
//                 Start Month *
//               </Typography>
//               <TextField
//                 type="month"
//                 size="small"
//                 fullWidth
//                 value={startMonth}
//                 onChange={(e) => setStartMonth(e.target.value)}
//                 error={!!errors.startMonth}
//                 helperText={errors.startMonth}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6} md={3}>
//               <Typography variant="body2" className="mb-1 font-medium">
//                 End Month *
//               </Typography>
//               <TextField
//                 type="month"
//                 size="small"
//                 fullWidth
//                 value={endMonth}
//                 onChange={(e) => setEndMonth(e.target.value)}
//                 error={!!errors.endMonth}
//                 helperText={errors.endMonth}
//               />
//             </Grid>

//             <Grid item xs={12} sm={6} md={2} className="flex items-end">
//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 size="medium"
//                 onClick={handleSearch}
//               >
//                 Search
//               </Button>
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Keyword Table */}
//         {showKeywordTable && (
//           <KeywordTable keywordsData={keywordsData} statetrueFalse={statetrueFalse} />
//         )}
//       </Card>

//       {/* State Section */}
//       {showStateSection && (
//         <Card container spacing={2} className="py-8 w-full shadow-none  p-4 rounded-md">
//           <Grid size={{ xs: 12 }}>
//             <CardHeader title="Keywords Name: " />
//           </Grid>

//           {/* State Filters */}
//           <Grid size={{ xs: 12 }}>
//             <Grid container spacing={2} className="mb-6 ">
//               <Grid item xs={12} sm={6} md={3}>
//                 <Typography variant="body2" className="mb-1 font-medium">
//                   Start Month *
//                 </Typography>
//                 <TextField
//                   type="month"
//                   size="small"
//                   fullWidth
//                   value={startStateMonth}
//                   onChange={(e) => setStartStateMonth(e.target.value)}
//                   error={!!errors.startMonth}
//                   helperText={errors.startMonth}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Typography variant="body2" className="mb-1 font-medium">
//                   End Month *
//                 </Typography>
//                 <TextField
//                   type="month"
//                   size="small"
//                   fullWidth
//                   value={endStateMonth}
//                   onChange={(e) => setEndStateMonth(e.target.value)}
//                   error={!!errors.endMonth}
//                   helperText={errors.endMonth}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={2} className="flex items-end ">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="medium"
//                   onClick={handleStateSearch}
//                 >
//                   Search
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>

//           {/* State Table */}
//           {showStateTable && (
//             <StateTable keywordDataState={keywordDataState} onSuccess={citytrueFalse} />
//           )}
//         </Card>
//       )}

//       {/* City Section */}
//       {showCitySection && (
//         <Card container spacing={2} className="py-8 w-full shadow-md  p-4 shadow-none rounded-md">
//           <Grid size={{ xs: 12 }}>
//             <CardHeader title="State Name: " />
//           </Grid>

//           {/* City Filters */}
//           <card size={{ xs: 12 }}>
//             <Grid container spacing={2} className="mb-6">
//               <Grid item xs={12} sm={6} md={3}>
//                 <Typography variant="body2" className="mb-1 font-medium">
//                   Start Month *
//                 </Typography>
//                 <TextField
//                   type="month"
//                   size="small"
//                   fullWidth
//                   value={startCityMonth}
//                   onChange={(e) => setStartCityMonth(e.target.value)}
//                   error={!!errors.startMonth}
//                   helperText={errors.startMonth}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Typography variant="body2" className="mb-1 font-medium">
//                   End Month *
//                 </Typography>
//                 <TextField
//                   type="month"
//                   size="small"
//                   fullWidth
//                   value={endCityMonth}
//                   onChange={(e) => setEndCityMonth(e.target.value)}
//                   error={!!errors.endMonth}
//                   helperText={errors.endMonth}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={2} className="flex items-end">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   size="medium"
//                   onClick={handleCitySearch}
//                 >
//                   Search
//                 </Button>
//               </Grid>
//             </Grid>
//           </card>

//           {/* City Table */}
//           {showCityTable && (
//             <CityTable keywordDataState={keywordDataCity} onSuccess={AreaTrueFalse} />
//           )}
//         </Card>
//       )}

//       {/* Area Section */}
//       {showAreaSection && (
//         <Card container spacing={2} className="py-8 w-full w-full shadow-none  p-4 rounded-md">
//           <Grid size={{ xs: 12 }}>
//             <CardHeader title="City Name: " />
//           </Grid>

          // {/* Area Filters */}
          // <Grid size={{ xs: 12 }}>
          //   <Grid container spacing={2} className="mb-6">
          //     <Grid item xs={12} sm={6} md={3}>
          //       <Typography variant="body2" className="mb-1 font-medium">
          //         Start Month *
          //       </Typography>
          //       <TextField
          //         type="month"
          //         size="small"
          //         fullWidth
          //         value={startAreaMonth}
          //         onChange={(e) => setStartAreaMonth(e.target.value)}
          //         error={!!errors.startMonth}
          //         helperText={errors.startMonth}
          //       />
          //     </Grid>

          //     <Grid item xs={12} sm={6} md={3}>
          //       <Typography variant="body2" className="mb-1 font-medium">
          //         End Month *
          //       </Typography>
          //       <TextField
          //         type="month"
          //         size="small"
          //         fullWidth
          //         value={endAreaMonth}
          //         onChange={(e) => setEndAreaMonth(e.target.value)}
          //         error={!!errors.endMonth}
          //         helperText={errors.endMonth}
          //       />
          //     </Grid>

          //     <Grid item xs={12} sm={6} md={2} className="flex items-end">
          //       <Button
          //         variant="contained"
          //         color="primary"
          //         fullWidth
          //         size="medium"
          //         onClick={handleAreaSearch}
          //       >
          //         Search
          //       </Button>
          //     </Grid>
          //   </Grid>
          // </Grid>

//           {/* Area Table */}
//           {showAreaTable && (
//             <AreaTables keywordDataState={keywordDataArea} />
//           )}
//         </Card>
//       )}
//     </Grid>
//   );
// }




"use client";

import { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { TextField, Paper, Typography, CardHeader, Button, Card } from '@mui/material';
import KeywordTable from '@/components/keyword/reportTable/KeywordTable';
import StateTable from '@/components/keyword/reportTable/StateTable';
import CityTable from '@/components/keyword/reportTable/CityTable';
import AreaTables from '@/components/keyword/reportTable/AreaTables';
import kyewordService from '@/services/keywords/createKeywordService'

export default function KeywordsReportPage() {
  // Date states
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [startStateMonth, setStartStateMonth] = useState('');
  const [endStateMonth, setEndStateMonth] = useState('');
  const [startCityMonth, setStartCityMonth] = useState('');
  const [endCityMonth, setEndCityMonth] = useState('');
  const [startAreaMonth, setStartAreaMonth] = useState('');
  const [endAreaMonth, setEndAreaMonth] = useState('');

  // Visibility states
  const [showKeywordTable, setShowKeywordTable] = useState(false);
  const [showStateSection, setShowStateSection] = useState(false);
  const [showStateTable, setShowStateTable] = useState(false);
  const [showCitySection, setShowCitySection] = useState(false);
  const [showCityTable, setShowCityTable] = useState(false);
  const [showAreaSection, setShowAreaSection] = useState(false);
  const [showAreaTable, setShowAreaTable] = useState(false);

  // Error states
  const [errors, setErrors] = useState({ 
    startMonth: '', 
    endMonth: '',
    startStateMonth: '',
    endStateMonth: '',
    startCityMonth: '',
    endCityMonth: '',
    startAreaMonth: '',
    endAreaMonth: ''
  });

  // Refs for scrolling
  const keywordSectionRef = useRef(null);
  const stateSectionRef = useRef(null);
  const citySectionRef = useRef(null);
  const areaSectionRef = useRef(null);

  const getKeyword = async () => {
    const result = await kyewordService.getKeyword();
    console.log(result, 'Keyword data');
  }

  useEffect(() => {
    getKeyword();
  }, []);

  // Auto-scroll effects
  useEffect(() => {
    if (showStateSection && stateSectionRef.current) {
      setTimeout(() => {
        stateSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showStateSection]);

  useEffect(() => {
    if (showCitySection && citySectionRef.current) {
      setTimeout(() => {
        citySectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showCitySection]);

  useEffect(() => {
    if (showAreaSection && areaSectionRef.current) {
      setTimeout(() => {
        areaSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showAreaSection]);

  // Your data arrays
   const keywordsData = [
    { keyword: 'software development company in noida', hits: 2547 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
    { keyword: 'software company in noida', hits: 1247 },
  ];

  const keywordDataState = [
    { state: 'Uttar Pradesh', hits: 255 },
    { state: 'Bihar', hits: 2555 },
    { state: 'Delhi', hits: 2555 },
    { state: 'Delhi', hits: 2555 },
    { state: 'Delhi', hits: 2555 },
    { state: 'Delhi', hits: 2555 },
  ];

  const keywordDataCity = [
    { city: 'Noida', hits: 123 },
    { city: 'Lucknow', hits: 456 },
    { city: 'Kanpur', hits: 789 },
  ];

  const keywordDataArea = [
    { area: 'Sector 15', hits: 150 },
    { area: 'Sector 18', hits: 300 },
    { area: 'Sector 21', hits: 500 },
  ];;

  // Search handlers with proper date validation
  const handleSearch = () => {
    const newErrors = { ...errors };

    if (!startMonth) newErrors.startMonth = 'Start month is required';
    else newErrors.startMonth = '';

    if (!endMonth) newErrors.endMonth = 'End month is required';
    else newErrors.endMonth = '';

    if (startMonth && endMonth && new Date(startMonth) > new Date(endMonth)) {
      newErrors.endMonth = 'End month cannot be before start month';
    }

    setErrors(newErrors);

    if (!newErrors.startMonth && !newErrors.endMonth) {
      setShowKeywordTable(true);
    }
  };

  const handleStateSearch = () => {
    const newErrors = { ...errors };

    if (!startStateMonth) newErrors.startStateMonth = 'Start month is required';
    else newErrors.startStateMonth = '';

    if (!endStateMonth) newErrors.endStateMonth = 'End month is required';
    else newErrors.endStateMonth = '';

    if (startStateMonth && endStateMonth && new Date(startStateMonth) > new Date(endStateMonth)) {
      newErrors.endStateMonth = 'End month cannot be before start month';
    }

    setErrors(newErrors);

    if (!newErrors.startStateMonth && !newErrors.endStateMonth) {
      setShowStateTable(true);
    }
  };

    const handleCitySearch = () => {
    const newErrors = { startMonth: '', endMonth: '' };

    if (!startCityMonth) newErrors.startMonth = 'Start month is required';
    if (!endCityMonth) newErrors.endMonth = 'End month is required';

    if (startCityMonth && endCityMonth && new Date(startCityMonth) > new Date(endCityMonth)) {
      newErrors.endMonth = 'End month cannot be before start month';
    }

    setErrors(newErrors);

    if (!newErrors.startMonth && !newErrors.endMonth) {
      console.log('City Search clicked', { startCityMonth, endCityMonth });
      setShowCityTable(true);
    }
  };


    const handleAreaSearch = () => {
    const newErrors = { startMonth: '', endMonth: '' };

    if (!startAreaMonth) newErrors.startMonth = 'Start month is required';
    if (!endAreaMonth) newErrors.endMonth = 'End month is required';

    if (startAreaMonth && endAreaMonth && new Date(startAreaMonth) > new Date(endAreaMonth)) {
      newErrors.endMonth = 'End month cannot be before start month';
    }

    setErrors(newErrors);

    if (!newErrors.startMonth && !newErrors.endMonth) {
      console.log('Area Search clicked', { startAreaMonth, endAreaMonth });
      setShowAreaTable(true);
    }
  };

  // Similar handlers for city and area...

  // Your existing toggle functions
  const statetrueFalse = () => {
    setShowStateSection(true);
    setShowStateTable(false);
    setShowCitySection(false);
    setShowCityTable(false);
    setShowAreaSection(false);
    setShowAreaTable(false);
  };

  const citytrueFalse = () => {
    setShowCitySection(true);
    setShowCityTable(false);
    setShowAreaSection(false);
    setShowAreaTable(false);
  };

  const AreaTrueFalse = () => {
    setShowAreaSection(true);
    setShowAreaTable(false);
  };

  return (
    <Grid container spacing={2} className="w-full relative">
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Paper elevation={2}>
          <CardHeader title="Keywords Report" />
        </Paper>
      </Grid>

      {/* Main Filters */}
      <Card className="py-8 w-full shadow-none p-4 rounded-md" ref={keywordSectionRef}>
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2} className="mb-6">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" className="mb-1 font-medium">
                Start Month *
              </Typography>
              <TextField
                type="month"
                size="small"
                fullWidth
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                error={!!errors.startMonth}
                helperText={errors.startMonth}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" className="mb-1 font-medium">
                End Month *
              </Typography>
              <TextField
                type="month"
                size="small"
                fullWidth
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                error={!!errors.endMonth}
                helperText={errors.endMonth}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2} className="flex items-end">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="medium"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {showKeywordTable && (
          <KeywordTable keywordsData={keywordsData} statetrueFalse={statetrueFalse} />
        )}
      </Card>

      {/* State Section */}
      {showStateSection && (
        <Card container spacing={2} className="py-8 w-full shadow-none p-4 rounded-md" ref={stateSectionRef}>
          <Grid size={{ xs: 12 }}>
            <CardHeader title="Keywords Name: " />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2} className="mb-6">
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="mb-1 font-medium">
                  Start Month *
                </Typography>
                <TextField
                  type="month"
                  size="small"
                  fullWidth
                  value={startStateMonth}
                  onChange={(e) => setStartStateMonth(e.target.value)}
                  error={!!errors.startStateMonth}
                  helperText={errors.startStateMonth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="mb-1 font-medium">
                  End Month *
                </Typography>
                <TextField
                  type="month"
                  size="small"
                  fullWidth
                  value={endStateMonth}
                  onChange={(e) => setEndStateMonth(e.target.value)}
                  error={!!errors.endStateMonth}
                  helperText={errors.endStateMonth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2} className="flex items-end">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="medium"
                  onClick={handleStateSearch}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {showStateTable && (
            <StateTable keywordDataState={keywordDataState} onSuccess={citytrueFalse} />
          )}
        </Card>
      )}

      {/* City Section */}
       {showCitySection && (
        <Card container spacing={2} className="py-8 w-full shadow-md  p-4 shadow-none rounded-md"ref={citySectionRef}>
          <Grid size={{ xs: 12 }}>
            <CardHeader title="State Name: " />
          </Grid>

          {/* City Filters */}
          <card size={{ xs: 12 }}>
            <Grid container spacing={2} className="mb-6">
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="mb-1 font-medium">
                  Start Month *
                </Typography>
                <TextField
                  type="month"
                  size="small"
                  fullWidth
                  value={startCityMonth}
                  onChange={(e) => setStartCityMonth(e.target.value)}
                  error={!!errors.startMonth}
                  helperText={errors.startMonth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="mb-1 font-medium">
                  End Month *
                </Typography>
                <TextField
                  type="month"
                  size="small"
                  fullWidth
                  value={endCityMonth}
                  onChange={(e) => setEndCityMonth(e.target.value)}
                  error={!!errors.endMonth}
                  helperText={errors.endMonth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2} className="flex items-end">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="medium"
                  onClick={handleCitySearch}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </card>

          {/* City Table */}
          {showCityTable && (
            <CityTable keywordDataState={keywordDataCity} onSuccess={AreaTrueFalse} />
          )}
        </Card>
      )}


      {showAreaSection && (
        <Card container spacing={2} className="py-8 w-full w-full shadow-none  p-4 rounded-md" ref={areaSectionRef}>
          <Grid size={{ xs: 12 }}>
            <CardHeader title="City Name: " />
          </Grid>

          {/* Area Filters */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2} className="mb-6">
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="mb-1 font-medium">
                  Start Month *
                </Typography>
                <TextField
                  type="month"
                  size="small"
                  fullWidth
                  value={startAreaMonth}
                  onChange={(e) => setStartAreaMonth(e.target.value)}
                  error={!!errors.startMonth}
                  helperText={errors.startMonth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" className="mb-1 font-medium">
                  End Month *
                </Typography>
                <TextField
                  type="month"
                  size="small"
                  fullWidth
                  value={endAreaMonth}
                  onChange={(e) => setEndAreaMonth(e.target.value)}
                  error={!!errors.endMonth}
                  helperText={errors.endMonth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2} className="flex items-end">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="medium"
                  onClick={handleAreaSearch}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Area Table */}
          {showAreaTable && (
            <AreaTables keywordDataState={keywordDataArea} />
          )}
        </Card>
      )}
      
    </Grid>
  );
}
