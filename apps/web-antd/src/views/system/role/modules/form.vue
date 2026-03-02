<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/system/role';

import { computed, nextTick, ref } from 'vue';

import { Tree, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Checkbox, CheckboxGroup, Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getAllMenuList } from '#/api/system/menu';
import { getAllPermissions } from '#/api/system/permission';
import { createRole, updateRole } from '#/api/system/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.SystemRole>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const permissions = ref<DataNode[]>([]);
const loadingPermissions = ref(false);

const apiPermissionOptions = ref<{ label: string; value: number }[]>([]);
const loadingApiPermissions = ref(false);
const selectedApiPermissions = ref<number[]>([]);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    // Map menuTree form field back to menuIds for the API
    const { menuTree, ...rest } = values;
    const submitData = {
      ...rest,
      menuIds: menuTree,
      apiPermissions: selectedApiPermissions.value,
    };
    drawerApi.lock();
    (id.value ? updateRole(id.value, submitData) : createRole(submitData))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      formApi.resetForm();
      selectedApiPermissions.value = [];

      if (data) {
        formData.value = data;
        id.value = data.id;
      } else {
        id.value = undefined;
      }

      if (permissions.value.length === 0) {
        await loadPermissions();
      }
      if (apiPermissionOptions.value.length === 0) {
        await loadApiPermissions();
      }
      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();
      await nextTick();
      if (data) {
        // Map menuIds from role data to the menuTree form field
        formApi.setValues({
          ...data,
          menuTree: data.menuIds,
        });
        // Set apiPermissions directly via local ref to avoid filterFields issues
        selectedApiPermissions.value = Array.isArray(data.apiPermissions)
          ? data.apiPermissions.map(Number)
          : [];
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getAllMenuList();
    permissions.value = res as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
  }
}

async function loadApiPermissions() {
  loadingApiPermissions.value = true;
  try {
    const res = await getAllPermissions();
    apiPermissionOptions.value = res.map((p) => ({
      label: `${p.name}`,
      value: Number(p.id),
    }));
  } finally {
    loadingApiPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.role.name'))
    : $t('common.create', $t('system.role.name'));
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
  }

  return classes.join(' ');
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #menuTree="slotProps">
        <Spin :spinning="loadingPermissions" wrapper-class-name="w-full">
          <Tree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </Tree>
        </Spin>
      </template>
      <template #apiPermissions>
        <Spin :spinning="loadingApiPermissions" wrapper-class-name="w-full">
          <div class="api-permissions-wrapper">
            <CheckboxGroup
              v-model:value="selectedApiPermissions"
              class="w-full"
            >
              <div class="api-permissions-grid">
                <Checkbox
                  v-for="(option, index) in apiPermissionOptions"
                  :key="option.value"
                  :value="option.value"
                  :class="{ 'api-permissions-full-row': index === 0 }"
                >
                  {{ option.label }}
                </Checkbox>
              </div>
            </CheckboxGroup>
          </div>
        </Spin>
      </template>
    </Form>
  </Drawer>
</template>
<style lang="css" scoped>
.api-permissions-wrapper {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.api-permissions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 12px;
}

:deep(.api-permissions-full-row) {
  grid-column: 1 / -1;
}
</style>
