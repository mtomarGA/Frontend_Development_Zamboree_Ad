"use client";

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
    TextField,
    Typography,
    CardHeader,
    Button,
    Card,
} from "@mui/material";
import SingleStateTable from "@/components/keyword/singletable/SingleStateTable";
import SingleCityTable from "@/components/keyword/singletable/SingleCity";
import SingleAreaTable from "@/components/keyword/singletable/SingleArea";
import { useParams } from "next/navigation";

import KeywordService from "@/services/keywords/createKeywordService";

export default function SingleKrywordHits() {
    const params = useParams();
    const id = params?.id;
    const formatMonthYear = (value) => {
        if (!value) return "";
        const [year, month] = value.split("-");
        return `${month}/${year}`;
    };
    const toInputValue = (value) => {
        if (!value) return "";
        const [month, year] = value.split("/");
        return `${year}-${month}`;
    };
    const [startStateMonth, setStartStateMonth] = useState("");
    const [endStateMonth, setEndStateMonth] = useState("");
    const [stateName, setStateName] = useState(false);
    const [showStateTable, setShowStateTable] = useState(false);
    const [showCitySection, setShowCitySection] = useState(false);
    const [showCityTable, setShowCityTable] = useState(false);
    const [showAreaSection, setShowAreaSection] = useState(false);
    const [showAreaTable, setShowAreaTable] = useState(false);


    const [errors, setErrors] = useState({ startMonth: "", endMonth: "" });
    const [keywordDataState, seKeywordDataState] = useState()
    const [keywordDataCity, sekeywordDataCity] = useState()
    const [keywordDataArea, setkeywordDataArea] = useState()
    const [cityName, setCityName] = useState()



    const [singleKeywordData, setSingleKeywordData] = useState();

    const getKeywordById = async () => {
        const result = await KeywordService.getSingleKeyword(id);
        setSingleKeywordData(result.data);
    };

    useEffect(() => {
        getKeywordById();
    }, []);

    

    const handleStateSearch = async () => {
        const newErrors = { startMonth: "", endMonth: "" };

        if (!startStateMonth) newErrors.startMonth = "Start month is required";
        if (!endStateMonth) newErrors.endMonth = "End month is required";

        if (
            startStateMonth &&
            endStateMonth &&
            new Date(toInputValue(startStateMonth)) >
            new Date(toInputValue(endStateMonth))
        ) {
            newErrors.endMonth = "End month cannot be before start month";
        }

        setErrors(newErrors);

        if (!newErrors.startMonth && !newErrors.endMonth) {
            const data = {
                startDate: startStateMonth, // already MM/YYYY
                endDate: endStateMonth,
            };
            const result = await KeywordService.getStateLavelHites(id, data)
            seKeywordDataState(result.data || [])

            setShowStateTable(true);
        }
    };

    const handleCitySearch = async (state) => {
        setStateName(state)
        setShowCitySection(true);
        setShowCityTable(false);
        setShowAreaSection(false);
        setShowAreaTable(false);
        const newErrors = { startMonth: "", endMonth: "" };
        if (!startStateMonth) newErrors.startMonth = "Start month is required";
        if (!endStateMonth) newErrors.endMonth = "End month is required";
        if (
            startStateMonth &&
            endStateMonth &&
            new Date(toInputValue(startStateMonth)) >
            new Date(toInputValue(endStateMonth))
        ) {
            newErrors.endMonth = "End month cannot be before start month";
        }
        const data = {
            stateName: state?.stateName,
            startDate: startStateMonth,
            endDate: endStateMonth
        }


        const result = await KeywordService.getCityLavelHites(id, data)
        sekeywordDataCity(result.data)

        setErrors(newErrors);

        if (!newErrors.startMonth && !newErrors.endMonth) {
            setShowCityTable(true);
        }
    };

    const handleAreaSearch = async (cityName) => {
        setCityName(cityName)
        setShowAreaSection(true);
        setShowAreaTable(false);
        const newErrors = { startMonth: "", endMonth: "" };
        if (!startStateMonth) newErrors.startMonth = "Start month is required";
        if (!endStateMonth) newErrors.endMonth = "End month is required";
        if (
            endStateMonth &&
            endStateMonth &&
            new Date(toInputValue(endStateMonth)) >
            new Date(toInputValue(endStateMonth))
        ) {
            newErrors.endMonth = "End month cannot be before start month";
        }
        setErrors(newErrors);
        if (!newErrors.startMonth && !newErrors.endMonth) {
            const data = {
                stateName: stateName.stateName,
                cityName: cityName?.cityName,
                startDate: startStateMonth,
                endDate: endStateMonth
            }
            console.log("Area Search clicked", data);
            const result = await KeywordService.getAreaLavelHites(id, data)
            setkeywordDataArea(result.data)

            setShowAreaTable(true);
        }
    };
    
    return (
        <Grid container spacing={2} className="w-full">
            {/* State Section */}
            <Card className="w-full shadow-none text-start px-4 rounded-md">
                <Grid size={{ xs: 12 }} className="text-start">
                    <CardHeader
                        title={
                            <p>
                                Keywords Name:{" "}
                                <span className="text-red-400 px-3">
                                    {singleKeywordData?.name}
                                </span>
                            </p>
                        }
                    />
                </Grid>

                {/* State Filters */}
                <Grid size={{ xs: 12 }}>
                    <Grid container spacing={2} className="mb-6 ">
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" className="mb-1 font-medium">
                                Start Month *
                            </Typography>
                            <TextField
                                type="month"
                                size="small"
                                fullWidth
                                value={toInputValue(startStateMonth)}
                                onChange={(e) => setStartStateMonth(formatMonthYear(e.target.value))}
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
                                value={toInputValue(endStateMonth)}
                                onChange={(e) => setEndStateMonth(formatMonthYear(e.target.value))}
                                error={!!errors.endMonth}
                                helperText={errors.endMonth}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2} className="flex items-end ">
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

                {/* State Table */}
                {showStateTable && (
                    <SingleStateTable keywordDataState={keywordDataState} handleCitySearch={handleCitySearch} />
                )}
            </Card>

            {showCitySection && (
                <Card className="py-8 w-full shadow-none text-start p-4 rounded-md">
                    <Grid size={{ xs: 12 }}>
                        <CardHeader
                            title={`State Name:  ${stateName?.stateName || ""}`}
                        />
                    </Grid>
                    {/* City Table */}
                    {showCityTable && (
                        <SingleCityTable keywordDataState={keywordDataCity} onSuccess={handleAreaSearch} />
                    )}
                </Card>
            )}

            {/* Area Section */}
            {showAreaSection && (
                <Card className="py-8 w-full text-start shadow-none p-4 rounded-md">
                    <Grid size={{ xs: 12 }}>
                        <CardHeader title={`City Name:  ${cityName?.cityName || ""}`} />
                    </Grid>
                    {/* Area Table */}
                    {showAreaTable && <SingleAreaTable keywordDataState={keywordDataArea} />}
                </Card>
            )}
        </Grid>
    );
}
