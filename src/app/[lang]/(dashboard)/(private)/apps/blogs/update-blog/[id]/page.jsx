import { ProtectedRoute } from '@/utils/ProtectedRoute'
import UpdateBlog from '@/views/apps/Blogs/update-blog/UpdateBlog'

const UpdateBlogApp = async () => {
    return <ProtectedRoute permission={"blog_all_blogs:edit"} ><UpdateBlog /></ProtectedRoute>
}

export default UpdateBlogApp

