import { eventHandler } from 'h3';
import { verifyAccessToken } from '~/utils/jwt-utils';
import {
  unAuthorizedResponse,
  useResponseSuccess,
} from '~/utils/response';

/**
 * GET /system/permission/all
 * 获取全部权限（不分页）
 */
export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  // In a real implementation, this would return all permissions from the database.
  // Here we return a static sample set for mock purposes.
  const allPermissions = [
    {
      id: 1,
      name: 'system:user:view',
      code: 'system:user:view',
      resource: '/system/user',
      remark: '查看用户',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
    {
      id: 2,
      name: 'system:user:manage',
      code: 'system:user:manage',
      resource: '/system/user',
      remark: '管理用户',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
    {
      id: 3,
      name: 'system:role:view',
      code: 'system:role:view',
      resource: '/system/role',
      remark: '查看角色',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
    {
      id: 4,
      name: 'system:role:manage',
      code: 'system:role:manage',
      resource: '/system/role',
      remark: '管理角色',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
    {
      id: 5,
      name: 'system:permission:view',
      code: 'permission:view',
      resource: '/system/permission',
      remark: '查看权限',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
    {
      id: 6,
      name: 'system:permission:manage',
      code: 'permission:manage',
      resource: '/system/permission',
      remark: '管理权限',
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
  ];

  return useResponseSuccess(allPermissions);
});

