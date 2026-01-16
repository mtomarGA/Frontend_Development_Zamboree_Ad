import Grid from '@mui/material/Grid2'


import Tag from '@/views/apps/Blogs/category/Tag'
import TagTable from '@/views/apps/Blogs/category/TagTable'
import { getEcommerceData } from '@/app/server/actions'
import { ProtectedRoute } from '@/utils/ProtectedRoute'

// import AddCategoryDrawer from ''
const TagApp = async () => {
    const data = await getEcommerceData()

    return <ProtectedRoute permission={"blog_master:view"} >
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <TagTable productData={data?.products} />
            </Grid>
        </Grid></ProtectedRoute>
}

export default TagApp

