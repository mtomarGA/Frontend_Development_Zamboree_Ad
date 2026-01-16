'use client'
import Grid from '@mui/material/Grid2'

// Component Imports
import AttributeForm from '@views/apps/product1/attributeForm/index'
import { useParams } from 'next/navigation'

const AttributeFormPage = async () => {

    const params = useParams()
    const id = params.id

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <AttributeForm mode="edit" id={id} />
            </Grid>
        </Grid>
    )
}

export default AttributeFormPage
