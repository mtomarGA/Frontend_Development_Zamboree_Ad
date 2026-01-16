'use client'

import GoalReport from "@/views/apps/performacnce/GoalReport"
import { useParams } from "next/navigation"

const GoalManage = () => {
    const params = useParams()
    const { id } = params
    return <GoalReport id={id} />
}

export default GoalManage
