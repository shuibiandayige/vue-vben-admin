import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemPermissionApi } from '#/api/system/permission';

import { z } from '#/adapter/form';
import { $t } from '#/locales';

/**
 * 编辑/创建抽屉表单字段配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.permission.permissionName'),
      rules: z
        .string()
        .min(
          1,
          $t('ui.formRules.minLength', [
            $t('system.permission.permissionName'),
            1,
          ]),
        )
        .max(
          50,
          $t('ui.formRules.maxLength', [
            $t('system.permission.permissionName'),
            50,
          ]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.permission.code'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.minLength', [$t('system.permission.code'), 1]))
        .max(
          100,
          $t('ui.formRules.maxLength', [$t('system.permission.code'), 100]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'resource',
      label: $t('system.permission.resource'),
      rules: z
        .string()
        .min(
          1,
          $t('ui.formRules.minLength', [$t('system.permission.resource'), 1]),
        )
        .max(
          100,
          $t('ui.formRules.maxLength', [$t('system.permission.resource'), 100]),
        ),
    },
    {
      component: 'Textarea',
      componentProps: {
        maxLength: 200,
        rows: 3,
        showCount: true,
      },
      fieldName: 'remark',
      label: $t('system.permission.remark'),
      rules: z
        .string()
        .max(
          200,
          $t('ui.formRules.maxLength', [$t('system.permission.remark'), 200]),
        )
        .optional(),
    },
  ];
}

/**
 * 表格顶部筛选表单字段配置
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.permission.permissionName'),
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.permission.code'),
    },
    {
      component: 'Input',
      fieldName: 'resource',
      label: $t('system.permission.resource'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: $t('system.permission.createdAt'),
    },
  ];
}

/**
 * 获取表格列配置
 */
export function useColumns<T = SystemPermissionApi.SystemPermission>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: $t('system.permission.id'),
      width: 80,
    },
    {
      field: 'name',
      title: $t('system.permission.permissionName'),
      minWidth: 150,
    },
    {
      field: 'code',
      title: $t('system.permission.code'),
      minWidth: 180,
    },
    {
      field: 'resource',
      title: $t('system.permission.resource'),
      minWidth: 150,
    },
    {
      field: 'remark',
      minWidth: 150,
      title: $t('system.permission.remark'),
    },
    {
      field: 'createTime',
      title: $t('system.permission.createdAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.permission.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.permission.operation'),
      width: 130,
    },
  ];
}

