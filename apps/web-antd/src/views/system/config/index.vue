<script lang="ts" setup>
import type { SystemConfigApi } from '#/api/system/config';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  FormItem,
  Input,
  message,
  Row,
  Select,
  Spin,
  Switch,
  Textarea,
} from 'ant-design-vue';

import {
  getSystemConfig,
  getTimezoneOptions,
  updateSystemConfig,
} from '#/api/system/config';
import { $t } from '#/locales';

defineOptions({ name: 'SystemConfig' });

const loading = ref(false);
const saving = ref(false);
const timezoneOptions = ref<SystemConfigApi.TimezoneOption[]>([]);

const formState = ref<SystemConfigApi.SystemConfigUpdate>({
  project_name: '',
  project_version: '',
  project_description: '',
  copyright: '',
  logo_url: '',
  login_background_url: '',
  keep_alive: true,
  animation_name: '',
  watermark_enabled: false,
  watermark_content: '',
  default_timezone: 'Asia/Shanghai',
});

async function fetchConfig() {
  loading.value = true;
  try {
    const [config, tzOptions] = await Promise.all([
      getSystemConfig(),
      getTimezoneOptions(),
    ]);
    formState.value = {
      project_name: config.project_name,
      project_version: config.project_version,
      project_description: config.project_description,
      copyright: config.copyright,
      logo_url: config.logo_url,
      login_background_url: config.login_background_url,
      keep_alive: config.keep_alive,
      animation_name: config.animation_name,
      watermark_enabled: config.watermark_enabled,
      watermark_content: config.watermark_content,
      default_timezone: config.default_timezone,
    };
    timezoneOptions.value = tzOptions;
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  saving.value = true;
  try {
    await updateSystemConfig(formState.value);
    message.success($t('system.config.saveSuccess'));
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchConfig();
});
</script>

<template>
  <Page :title="$t('page.system.config')">
    <Spin :spinning="loading">
      <Form layout="vertical" :model="formState">
        <!-- 基本信息 -->
        <Card :bordered="false" class="mb-4">
          <template #title>
            <span>{{ $t('system.config.basicInfo') }}</span>
          </template>
          <Row :gutter="24">
            <Col :span="12">
              <FormItem :label="$t('system.config.projectName')">
                <Input
                  v-model:value="formState.project_name"
                  :maxlength="100"
                  show-count
                  :placeholder="$t('system.config.projectName')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('system.config.projectVersion')">
                <Input
                  v-model:value="formState.project_version"
                  :maxlength="20"
                  show-count
                  :placeholder="$t('system.config.projectVersion')"
                />
              </FormItem>
            </Col>
            <Col :span="24">
              <FormItem :label="$t('system.config.projectDescription')">
                <Textarea
                  v-model:value="formState.project_description"
                  :maxlength="500"
                  show-count
                  :rows="3"
                  :placeholder="$t('system.config.projectDescription')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('system.config.copyright')">
                <Input
                  v-model:value="formState.copyright"
                  :maxlength="200"
                  show-count
                  :placeholder="$t('system.config.copyright')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('system.config.defaultTimezone')">
                <Select
                  v-model:value="formState.default_timezone"
                  :options="timezoneOptions"
                  :placeholder="$t('system.config.defaultTimezone')"
                  class="w-full"
                  show-search
                  option-filter-prop="label"
                />
              </FormItem>
            </Col>
          </Row>
        </Card>

        <!-- 外观配置 -->
        <Card :bordered="false" class="mb-4">
          <template #title>
            <span>{{ $t('system.config.appearance') }}</span>
          </template>
          <Row :gutter="24">
            <Col :span="12">
              <FormItem :label="$t('system.config.logoUrl')">
                <Input
                  v-model:value="formState.logo_url"
                  :maxlength="500"
                  :placeholder="$t('system.config.logoUrl')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('system.config.loginBackgroundUrl')">
                <Input
                  v-model:value="formState.login_background_url"
                  :maxlength="500"
                  :placeholder="$t('system.config.loginBackgroundUrl')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('system.config.animationName')">
                <Input
                  v-model:value="formState.animation_name"
                  :maxlength="50"
                  :placeholder="$t('system.config.animationName')"
                />
              </FormItem>
            </Col>
          </Row>
        </Card>

        <!-- 功能开关 -->
        <Card :bordered="false" class="mb-4">
          <template #title>
            <span>{{ $t('system.config.features') }}</span>
          </template>
          <Row :gutter="24">
            <Col :span="12">
              <FormItem :label="$t('system.config.keepAlive')">
                <Switch
                  v-model:checked="formState.keep_alive"
                  :checked-children="$t('common.enabled')"
                  :un-checked-children="$t('common.disabled')"
                />
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('system.config.watermarkEnabled')">
                <Switch
                  v-model:checked="formState.watermark_enabled"
                  :checked-children="$t('common.enabled')"
                  :un-checked-children="$t('common.disabled')"
                />
              </FormItem>
            </Col>
            <Col v-if="formState.watermark_enabled" :span="12">
              <FormItem :label="$t('system.config.watermarkContent')">
                <Input
                  v-model:value="formState.watermark_content"
                  :maxlength="200"
                  show-count
                  :placeholder="$t('system.config.watermarkContent')"
                />
              </FormItem>
            </Col>
          </Row>
        </Card>

        <Divider />

        <div class="mr-12 flex justify-end">
          <Button type="primary" :loading="saving" @click="handleSave">
            {{ $t('common.save') }}
          </Button>
        </div>
      </Form>
    </Spin>
  </Page>
</template>
