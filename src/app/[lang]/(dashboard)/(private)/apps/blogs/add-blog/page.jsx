'use client'

import { ProtectedRoute } from '@/utils/ProtectedRoute'
import AddBlog from '@/views/apps/Blogs/add-blog/AddBlog'

const BlogApp = async () => {
  return  <ProtectedRoute permission={"blog_all_blogs:add"} ><AddBlog /></ProtectedRoute> 
}

export default BlogApp

