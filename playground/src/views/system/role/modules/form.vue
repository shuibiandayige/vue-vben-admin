<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/system/role';

import { computed, nextTick, ref } from 'vue';

import { Tree, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Input, Spin, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
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

// apiPermissions input state
const apiPermissionInput = ref('');

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateRole(id.value, values) : createRole(values))
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
      apiPermissionInput.value = '';

      if (data) {
        formData.value = data;
        id.value = data.id;
      } else {
        id.value = undefined;
      }

      if (permissions.value.length === 0) {
        await loadPermissions();
      }
      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    permissions.value = res as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
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

async function addApiPermission() {
  const raw = apiPermissionInput.value.trim();
  if (!raw) return;
  const id = Number(raw);
  if (!Number.isInteger(id) || Number.isNaN(id)) return;
  const values = await formApi.getValues();
  const current = (values.apiPermissions as number[]) ?? [];
  if (!current.includes(id)) {
    formApi.setFieldValue('apiPermissions', [...current, id]);
  }
  apiPermissionInput.value = '';
}

async function removeApiPermission(id: number) {
  const values = await formApi.getValues();
  const current = (values.apiPermissions as number[]) ?? [];
  formApi.setFieldValue(
    'apiPermissions',
    current.filter((c) => c !== id),
  );
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #menuIds="slotProps">
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
      <template #apiPermissions="slotProps">
        <div class="flex w-full flex-col gap-2">
          <div class="flex gap-2">
            <Input
              v-model:value="apiPermissionInput"
              :placeholder="$t('system.role.apiPermissionPlaceholder')"
              allow-clear
              @press-enter="addApiPermission"
            />
            <a-button type="primary" @click="addApiPermission">
              {{ $t('common.add') }}
            </a-button>
          </div>
          <div class="flex flex-wrap gap-1">
            <Tag
              v-for="permId in slotProps.modelValue as number[]"
              :key="permId"
              closable
              @close="removeApiPermission(permId)"
            >
              {{ permId }}
            </Tag>
          </div>
        </div>
      </template>
    </Form>
  </Drawer>
</template>
