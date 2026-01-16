import { ProtectedRoute } from '@/utils/ProtectedRoute'
import BlogList from '@/views/apps/Blogs/add-blog/BlogList'

const BlogApp = async () => {
  return <ProtectedRoute permission={"blog_all_blogs:view"} ><BlogList /></ProtectedRoute>
}

export default BlogApp

