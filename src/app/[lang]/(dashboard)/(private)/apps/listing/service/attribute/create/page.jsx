// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AttributeForm from '@views/apps/listing/service/attributeForm/index'

const AttributeFormPage = async () => {

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <AttributeForm mode="create" />
            </Grid>
        </Grid>
    )
}

export default AttributeFormPage
