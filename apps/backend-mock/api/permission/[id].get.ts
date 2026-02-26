import { eventHandler, getRouterParam } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse, useResponseSuccess } from '~/utils/response';

/**
 * GET /system/permission/:id
 * 获取单个权限详情
 */
export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const id = getRouterParam(event, 'id');

  return useResponseSuccess({
    id: Number(id),
    name: `permission:${id}`,
    code: `permission:code:${id}`,
    resource: `/system/resource/${id}`,
    remark: null,
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
  });
});
