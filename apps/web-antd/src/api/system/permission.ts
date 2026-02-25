import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemPermissionApi {
  export interface SystemPermission {
    id: number;
    name: string;
    code: string;
    resource: string;
    remark?: null | string;
    createTime: string;
  }

  export interface PermissionCreateBody {
    name: string;
    code: string;
    resource: string;
    remark?: string;
  }

  export interface PermissionUpdateBody {
    name?: string;
    code?: string;
    resource?: string;
    remark?: string;
  }
}

/**
 * 获取权限列表（分页）
 */
async function getPermissionList(params: Recordable<any>) {
  return requestClient.get<{
    items: SystemPermissionApi.SystemPermission[];
    total: number;
  }>('/system/permission/list', { params });
}

/**
 * 获取全部权限（不分页，用于下拉等场景）
 */
async function getAllPermissions() {
  return requestClient.get<SystemPermissionApi.SystemPermission[]>(
    '/system/permission/all',
  );
}

/**
 * 获取单个权限详情
 * @param id 权限 ID
 */
async function getPermissionById(id: number) {
  return requestClient.get<SystemPermissionApi.SystemPermission>(
    `/system/permission/${id}`,
  );
}

/**
 * 创建权限
 * @param data 权限数据
 */
async function createPermission(
  data: SystemPermissionApi.PermissionCreateBody,
) {
  return requestClient.post<SystemPermissionApi.SystemPermission>(
    '/system/permission',
    data,
  );
}

/**
 * 更新权限
 * @param id 权限 ID
 * @param data 权限数据
 */
async function updatePermission(
  id: number,
  data: SystemPermissionApi.PermissionUpdateBody,
) {
  return requestClient.put<SystemPermissionApi.SystemPermission>(
    `/system/permission/${id}`,
    data,
  );
}

/**
 * 删除权限
 * @param id 权限 ID
 */
async function deletePermission(id: number) {
  return requestClient.delete(`/system/permission/${id}`);
}

export {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
  getPermissionList,
  updatePermission,
};

