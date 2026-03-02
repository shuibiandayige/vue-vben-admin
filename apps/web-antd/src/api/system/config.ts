import { requestClient } from '#/api/request';

export namespace SystemConfigApi {
  export interface SystemConfig {
    id: number;
    project_name: string;
    project_version: string;
    project_description: null | string;
    copyright: null | string;
    logo_url: null | string;
    login_background_url: null | string;
    keep_alive: boolean;
    animation_name: null | string;
    watermark_enabled: boolean;
    watermark_content: null | string;
    default_timezone: string;
  }

  export interface SystemConfigUpdate {
    project_name?: null | string;
    project_version?: null | string;
    project_description?: null | string;
    copyright?: null | string;
    logo_url?: null | string;
    login_background_url?: null | string;
    keep_alive?: boolean | null;
    animation_name?: null | string;
    watermark_enabled?: boolean | null;
    watermark_content?: null | string;
    default_timezone?: null | string;
  }

  export interface TimezoneOption {
    label: string;
    value: string;
  }

  export interface TimezoneSetBody {
    timezone: string;
  }
}

/**
 * 获取系统配置
 */
async function getSystemConfig() {
  return requestClient.get<SystemConfigApi.SystemConfig>('/system/config');
}

/**
 * 更新系统配置
 * @param data 系统配置数据
 */
async function updateSystemConfig(data: SystemConfigApi.SystemConfigUpdate) {
  return requestClient.put<SystemConfigApi.SystemConfig>(
    '/system/config',
    data,
  );
}

/**
 * 获取可用时区列表
 */
async function getTimezoneOptions() {
  return requestClient.get<SystemConfigApi.TimezoneOption[]>(
    '/system/timezone/options',
  );
}

/**
 * 获取当前用户时区
 */
async function getUserTimezone() {
  return requestClient.get<null | string>('/system/timezone');
}

/**
 * 设置当前用户时区
 * @param timezone IANA 时区字符串
 */
async function setUserTimezone(timezone: string) {
  return requestClient.post('/system/timezone', { timezone });
}

export {
  getSystemConfig,
  getTimezoneOptions,
  getUserTimezone,
  setUserTimezone,
  updateSystemConfig,
};
