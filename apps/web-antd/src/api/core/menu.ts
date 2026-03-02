import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用系统有菜单
 */
export async function getUserMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/list');
}
