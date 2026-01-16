import { Editor } from "@/components/editor/Editor"
import { useAuth } from "@/contexts/AuthContext"
import ApplicationDataService from "@/services/applicationData/applicationDataService"
import { Box, Button, Skeleton } from "@mui/material"
import { useEffect, useState } from "react"

const ApplicationEditor = ({ html, setHtml, handleSubmit, appName, pageName }) => {

    const { hasPermission } = useAuth();

    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        const ress = await ApplicationDataService.getData(appName, pageName)
        if (ress && ress.data) {
            setHtml(ress.data.content)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (appName && pageName) {
            fetchData()
        }
    }, [appName, pageName])

    return (
        <Box>
            {/* create skeleton loading state */}
            {loading ? (
                <Skeleton variant="rect" width="100%" height={400} />
            ) : (
                <Editor error={""} htmlContent={html} setHtmlContent={setHtml} />
            )}
            <Box mt={2}>
                {hasPermission("settings_application_settings:edit") && <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>}
            </Box>
        </Box>
    )
}

export default ApplicationEditor
