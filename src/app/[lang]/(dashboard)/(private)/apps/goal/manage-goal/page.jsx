import { ProtectedRoute } from "@/utils/ProtectedRoute"
import GoalManageList from "@views/apps/performacnce/GoalManageList"


const GoalManage  = () => {

    return <ProtectedRoute permission={"performance_goal:view"}><GoalManageList /></ProtectedRoute> 
       
}

export default GoalManage
