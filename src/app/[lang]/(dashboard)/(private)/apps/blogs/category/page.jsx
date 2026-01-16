import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddCategory from '@/views/apps/Blogs/category/AddCategory'

// import AddCategoryDrawer from ''
const ComponentName = () => {
  return <ProtectedRoute permission={"blog_master:view"} ><AddCategory/></ProtectedRoute>



}



export default ComponentName

