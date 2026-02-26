import { eventHandler, readBody } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  sleep,
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response';

/**
 * POST /system/permission
 * 创建权限
 */
export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const body = await readBody(event);
  await sleep(600);

  // Mock: return the created permission with a generated id
  const now = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

  return useResponseSuccess({
    id: Math.floor(Math.random() * 9000) + 1000,
    name: body.name,
    code: body.code,
    resource: body.resource,
    remark: body.remark ?? null,
    createdAt: now,
    updatedAt: now,
  });
});
