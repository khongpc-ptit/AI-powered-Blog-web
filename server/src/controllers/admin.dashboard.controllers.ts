import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ADMIN_DASHBOARD_MESSAGES } from '~/constants/messages'
import adminDashboardService from '~/services/admin.dashboard.services'

export const getDashboardStatsController = async (req: Request, res: Response) => {
  const stats = await adminDashboardService.getDashboardStats()

  return res.status(HTTP_STATUS.OK).json({
    message: ADMIN_DASHBOARD_MESSAGES.GET_DASHBOARD_STATS_SUCCESS,
    result: stats
  })
}
