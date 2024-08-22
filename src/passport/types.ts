// 域: 每个 UOS AppID(也称为主域 idDomainID) 下, 可以有多个域. 域可以视为一个游戏区, 例如电信1区/移动2区 等
// 用户: 每个主域下, 共享同一个用户数据库
// 角色: 每个用户在每一个域里面可以创建一个(目前只能一个)
//
// 综合而言:
// 1. 玩家在同一个游戏(主域)里只有一个账号(基于设备 ID, 第三方账号等).
// 2. 玩家在不同游戏区有不同的游戏角色

export const UosPassportEndpoint = 'https://p.unity.cn';

// 域
export interface UosRealm {
  // 域 ID
  realmID: string;

  // UOS AppID
  idDomainID: string;

  // 名称
  name: string;

  // 状态
  status: UosRealmStatus;

  // 关联到外部系统的域 ID
  externalRealmID?: string;

  // 创建时间 ISO 8601
  createdAt: string;

  // 修改时间 ISO 8601
  modifiedAt: string;

  // 附加属性
  properties?: UosCustomProperties;
}

// 域状态
export enum UosRealmStatus {
  // 已创建
  Created = 'Created',

  // 正常
  Open = 'Open',

  // 关闭
  Closed = 'Closed',

  // 维护中
  Maintenance = 'Maintenance',
}

export function isUosRealm(r: unknown): r is UosRealm {
  return (
    typeof r === 'object' && r !== null && (r as UosRealm).realmID !== undefined
  );
}

// 用户
export interface UosUser {
  // 用户 ID
  userID: string;

  // 外部用户 ID
  externalUserID: string;

  // UOS AppID
  idDomainID: string;

  // 用户是否已经删除
  deleted: boolean;

  // 用户状态
  userStatus: UosUserStatus;

  // 当前登录设备的 ID
  currentDeviceID: string;

  // 最后登录 IP
  lastLoginIp: string;

  // 最后登录时间 ISO 8601
  lastLoginAt: string;

  // 登录方法
  loginMethod: string;

  // 登录平台
  loginPlatform: string;

  // 登录 ID 提供方
  loginIDProvider: string;

  // 是否通过了实名认证
  isRealNameVerified: boolean;

  // 用户年龄段(仅在实名认证通过后有效)
  ageGroup?: UosUserAgeGroup;

  // 是否大于登录年龄限制(仅在实名认证通过后有效)
  aboveMinAge?: boolean;

  // 电子邮件
  email: string;

  // 电子邮件是否已经通过验证
  emailVerified: boolean;

  // 电话号码
  phoneNumber: string;

  // 电话号码是否已经通过验证
  phoneNumberVerified: boolean;

  // 昵称
  displayName: string;

  // 头像 URL
  avatarUrl: string;

  // 创建时间 ISO 8601
  createdAt: string;

  // 修改时间 ISO 8601
  modifiedAt: string;

  // 用户属性
  properties: UosCustomProperties;
}

// 用户状态
export enum UosUserStatus {
  // 可用
  Active = 'Active',

  // 禁用
  Banned = 'Banned',

  // 已删除
  Sealed = 'Sealed',
}

// 用户年龄组(通过实名验证后有效)
export enum UosUserAgeGroup {
  // 低于 8 岁
  UnderEight = 'UnderEight',

  // 8岁 - 16 岁以下
  EightToSixteen = 'EightToSixteen',

  // 16岁 - 18 岁以下
  SixteenToEighteen = 'SixteenToEighteen',

  // 18岁及以上
  AboveEighteen = 'AboveEighteen',
}

export function isUosUser(u: unknown): u is UosUser {
  return (
    typeof u === 'object' && u !== null && (u as UosUser).userID !== undefined
  );
}

// 角色
export interface UosPersona {
  // 域 ID
  realmID: string;

  // 用户 ID
  userID: string;

  // 角色 ID
  personaID: string;

  // UOS AppID
  idDomainID: string;

  // 昵称
  displayName: string;

  // 角色扩展属性
  properties: UosCustomProperties;

  // 创建时间
  createdAt: string;

  // 修改时间
  modifiedAt: string;

  // 实名
  realmName: string;

  // 状态
  status: UosPersonaStatus;
}

export function isUosPersona(p: unknown): p is UosPersona {
  return (
    typeof p === 'object' && p !== null && (p as UosPersona).personaID !== null
  );
}

// 角色状态
export enum UosPersonaStatus {
  // 可用
  Active = 'Active',

  // 禁用
  Banned = 'Banned',

  // 已删除
  Sealed = 'Sealed',
}

// 自定义属性
export interface UosCustomProperties {
  [key: string]: unknown;
}

export interface UosFriendRelation {
  // 好友关系 ID
  id: string;

  // 主域 ID
  idDomainID: string;

  // 自己的角色 ID
  sourcePersonalID: string;
  // 自己的域 ID
  sourceRealmID: string;
  // 自己的域名称
  sourceRealmName: string;

  // 好友的角色 ID
  targetPersonalID: string;
  // 好友的域 ID
  targetRealmID: string;
  // 好友的域名称
  targetRealmName: string;
  // 好友角色的自定义属性
  targetPersonaProperties?: UosCustomProperties;

  // 好友的昵称
  displayName: string;

  // 好友的状态
  status: string;

  // 好友头像 URL
  iconUrl?: string;

  // 创建时间
  createdAt: string;

  // 修改时间
  modifiedAt: string;
}
