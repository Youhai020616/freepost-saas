# 侧边栏社交媒体平台更新

## 更新概述

为 Dashboard 侧边栏添加了更多社交媒体平台支持，并实现了平台管理功能。

## 新增功能

### 1. 新增社交媒体平台（共13个）

#### 原有平台（5个）
- Twitter / X
- Facebook
- Instagram
- LinkedIn
- YouTube

#### 新增平台（8个）
- **TikTok** - 短视频社交平台
- **Threads** - Meta 推出的文字社交平台
- **Bluesky** - 去中心化社交网络
- **Medium** - 博客内容平台
- **Pinterest** - 图片分享平台
- **Reddit** - 社区讨论平台
- **Discord** - 即时通讯和社区平台
- **Telegram** - 即时通讯平台

### 2. 平台分类系统

所有平台按用途分为 4 个类别：

- **Social Media（社交媒体）**: Twitter, Facebook, Instagram, TikTok, Threads, Bluesky, Reddit
- **Professional（专业平台）**: LinkedIn
- **Media & Content（媒体与内容）**: YouTube, Medium, Pinterest
- **Messaging（即时通讯）**: Discord, Telegram

### 3. 平台管理功能

#### "Add More Platforms" 对话框
点击侧边栏底部的 "Add More Platforms" 按钮，会弹出平台选择对话框，包含以下功能：

- **分类展示**：按 4 个类别组织显示所有可用平台
- **可视化选择**：点击平台卡片即可添加/移除到侧边栏
- **状态指示**：已添加的平台显示勾选标记和高亮样式
- **即时更新**：选择/取消选择立即反映在侧边栏

#### 侧边栏平台管理
- **移除平台**：鼠标悬停在平台卡片上时，显示删除图标（垃圾桶），点击可从侧边栏移除
- **灵活布局**：只显示用户选择的平台，保持界面简洁
- **状态保持**：平台的连接状态独立于显示状态

## 技术实现

### 新增组件

1. **Dialog 组件** (`apps/web/src/components/ui/dialog.tsx`)
   - 基于 Radix UI 的对话框组件
   - 支持响应式布局和动画效果
   - 包含 Header、Content、Footer 等子组件

### 数据结构

```typescript
interface SocialPlatformDefinition {
  id: string;
  platform: string;
  icon: React.ComponentType;
  color: string;
  category: 'social' | 'professional' | 'media' | 'messaging';
}

interface SocialAccount extends SocialPlatformDefinition {
  username: string;
  connected: boolean;
  isVisible: boolean;  // 控制是否在侧边栏显示
}
```

### 状态管理

- `socialAccounts`: 所有平台的完整数据（包括连接状态和可见性）
- `visibleAccounts`: 过滤后只显示可见的平台
- `isDialogOpen`: 控制平台选择对话框的显示

### 核心功能函数

1. **handleTogglePlatformVisibility(platformId)**
   - 在对话框中切换平台的可见性
   - 更新 `socialAccounts` 状态

2. **handleRemovePlatform(platformId)**
   - 从侧边栏移除平台
   - 设置 `isVisible: false`

3. **handleConnectPlatform(platformId)**
   - 触发 OAuth 连接流程（待实现）

## 用户体验优化

1. **响应式交互**
   - 鼠标悬停时显示删除按钮
   - 平台卡片的 hover 效果
   - 选中状态的视觉反馈

2. **视觉设计**
   - 每个平台使用品牌颜色的图标
   - 连接状态用绿色指示器显示
   - 未连接平台使用虚线边框

3. **布局优化**
   - 对话框采用 2 列网格布局
   - 按分类组织，便于查找
   - 支持滚动查看所有平台

## 默认配置

默认在侧边栏显示的平台：
- Twitter
- Facebook
- Instagram
- LinkedIn
- YouTube

用户可以通过 "Add More Platforms" 添加其他平台。

## 未来扩展

### 待实现功能
1. **OAuth 连接流程**
   - 实现各平台的 OAuth 认证
   - 保存 access token 和 refresh token
   - 处理 token 过期和刷新

2. **平台管理 API**
   - 保存用户的平台选择到数据库
   - 同步跨设备的平台配置

3. **批量操作**
   - 一键添加所有社交平台
   - 一键添加所有媒体平台

4. **搜索功能**
   - 在对话框中搜索平台

## 文件修改清单

### 新建文件
- `apps/web/src/components/ui/dialog.tsx` - Dialog 组件

### 修改文件
- `apps/web/src/components/dashboard/dashboard-sidebar.tsx` - 侧边栏主组件

## 测试建议

1. **功能测试**
   - 点击 "Add More Platforms" 打开对话框
   - 在对话框中添加/移除平台
   - 验证侧边栏实时更新
   - 测试删除按钮的悬停显示

2. **视觉测试**
   - 检查所有平台图标正确显示
   - 验证品牌颜色应用正确
   - 测试折叠/展开状态

3. **响应式测试**
   - 测试不同屏幕尺寸下的布局
   - 验证对话框的滚动行为

## 性能考虑

- 所有平台图标使用 SVG，无需额外加载
- 状态更新采用不可变更新模式
- Dialog 组件支持懒加载

## 总结

此次更新将可连接的社交媒体平台从 5 个扩展到 13 个，并提供了灵活的平台管理界面，让用户可以自定义侧边栏显示的平台。所有新功能都遵循现有的设计系统和代码规范。
