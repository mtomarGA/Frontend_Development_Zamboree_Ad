import CategoryBannerTable from "@/views/apps/category-banner/Category-banner"
import { ProtectedRoute } from "@/utils/ProtectedRoute"

const CategoryBanner = () => {
  return (
    <ProtectedRoute permission={"partner_banner_setup:view"}>
      <CategoryBannerTable />
    </ProtectedRoute>
  )
}

export default CategoryBanner
