# NeoButton 组件使用指南

一个基于 Neobrutalism 设计风格的动态按钮组件，具有独特的阴影和动画效果。

## 特性

- 🎨 **Neobrutalism 设计风格** - 大胆的边框和阴影效果
- ✨ **流畅的悬停动画** - 平滑的阴影移动效果
- 🌓 **深色模式支持** - 自动适配深色主题
- 📦 **TypeScript 支持** - 完整的类型定义
- ♿ **无障碍友好** - 支持键盘导航和焦点状态
- 🎯 **多种变体** - default, neutral, noShadow, reverse

## 安装依赖

确保已安装以下依赖：

```bash
pnpm add @radix-ui/react-slot class-variance-authority
```

## 快速开始

### 基础用法

```tsx
import { NeoButton } from '@/components/ui/neo-button'
import { Send } from 'lucide-react'

export default function Example() {
  return (
    <NeoButton>
      <Send className="w-4 h-4" />
      发送消息
    </NeoButton>
  )
}
```

## 变体 (Variants)

### 1. Default - 默认按钮

主要操作按钮，带有彩色背景和阴影效果。

```tsx
<NeoButton variant="default">
  <Send className="w-4 h-4" />
  Publish Now
</NeoButton>
```

**使用场景**：
- 主要操作（发布、提交、确认）
- 需要强调的按钮
- CTA（Call-to-Action）按钮

---

### 2. Neutral - 中性按钮

白色背景的中性按钮，适合次要操作。

```tsx
<NeoButton variant="neutral">
  <Save className="w-4 h-4" />
  Save Draft
</NeoButton>
```

**使用场景**：
- 次要操作（保存草稿、取消）
- 不希望过于突出的操作
- 需要与主要按钮形成对比

---

### 3. NoShadow - 无阴影按钮

扁平化设计，无阴影效果。

```tsx
<NeoButton variant="noShadow">
  <Eye className="w-4 h-4" />
  Preview
</NeoButton>
```

**使用场景**：
- 辅助操作（预览、查看详情）
- 需要更低视觉层级的按钮
- 密集布局中的按钮

---

### 4. Reverse - 反向动画按钮

悬停时阴影反向移动的效果。

```tsx
<NeoButton variant="reverse">
  <Upload className="w-4 h-4" />
  Upload Media
</NeoButton>
```

**使用场景**：
- 特殊操作（上传、导入）
- 需要独特视觉效果的按钮
- 创意性交互

---

## 尺寸 (Sizes)

### Small

```tsx
<NeoButton size="sm">Small Button</NeoButton>
```

**高度**: 36px (h-9)  
**使用场景**: 表格操作、紧凑布局

---

### Default

```tsx
<NeoButton size="default">Default Button</NeoButton>
```

**高度**: 40px (h-10)  
**使用场景**: 大多数场景的标准按钮

---

### Large

```tsx
<NeoButton size="lg">Large Button</NeoButton>
```

**高度**: 44px (h-11)  
**使用场景**: 重要的 CTA 按钮、移动端

---

### Icon Only

仅显示图标的正方形按钮。

```tsx
<NeoButton size="icon">
  <Plus className="w-4 h-4" />
</NeoButton>
```

**尺寸**: 40x40px (h-10 w-10)  
**使用场景**: 工具栏、操作栏

---

## 完整示例

### Composer 页面头部

```tsx
import { NeoButton } from '@/components/ui/neo-button'
import { Send, Save, Eye } from 'lucide-react'

export default function ComposeHeader() {
  return (
    <div className="flex items-center gap-3">
      <NeoButton variant="neutral" size="default">
        <Save className="w-4 h-4" />
        Save Draft
      </NeoButton>
      
      <NeoButton variant="noShadow" size="default">
        <Eye className="w-4 h-4" />
        Preview
      </NeoButton>
      
      <NeoButton variant="default" size="lg">
        <Send className="w-4 h-4" />
        Publish Now
      </NeoButton>
    </div>
  )
}
```

### Media 页面

```tsx
import { NeoButton } from '@/components/ui/neo-button'
import { Upload, Download, Trash2 } from 'lucide-react'

export default function MediaActions() {
  return (
    <div className="flex items-center gap-3">
      <NeoButton variant="default" size="default">
        <Upload className="w-4 h-4" />
        Upload Media
      </NeoButton>
      
      <NeoButton variant="neutral" size="sm">
        <Download className="w-4 h-4" />
        Download
      </NeoButton>
      
      <NeoButton variant="noShadow" size="sm">
        <Trash2 className="w-4 h-4" />
        Delete
      </NeoButton>
    </div>
  )
}
```

### Schedule 页面

```tsx
import { NeoButton } from '@/components/ui/neo-button'
import { Plus, Calendar } from 'lucide-react'

export default function ScheduleHeader() {
  return (
    <div className="flex items-center gap-3">
      <NeoButton variant="default" size="default">
        <Plus className="w-4 h-4" />
        Schedule Post
      </NeoButton>
      
      <NeoButton variant="neutral" size="icon">
        <Calendar className="w-4 h-4" />
      </NeoButton>
    </div>
  )
}
```

---

## 高级用法

### 作为链接使用

使用 `asChild` 属性将按钮样式应用到其他元素。

```tsx
import Link from 'next/link'

<NeoButton asChild>
  <Link href="/dashboard">
    Go to Dashboard
  </Link>
</NeoButton>
```

### 禁用状态

```tsx
<NeoButton disabled>
  Disabled Button
</NeoButton>
```

### 自定义类名

```tsx
<NeoButton className="w-full">
  Full Width Button
</NeoButton>
```

---

## 样式定制

### CSS 变量

所有颜色都通过 CSS 变量定义，可以在全局样式中自定义：

```css
:root {
  --main: #88aaee;        /* 主色调 */
  --bg: #dfe5f2;          /* 背景色 */
  --text: #000;           /* 文字色 */
  --border: #000;         /* 边框色 */
  --shadow: 4px 4px 0px 0px var(--border); /* 阴影 */
}

.dark {
  --main: #88aaee;
  --bg: #272933;
  --text: #e6e6e6;
  --border: #000;
}
```

### 阴影配置

在 `tailwind.config.js` 中配置阴影距离：

```js
module.exports = {
  theme: {
    extend: {
      translate: {
        boxShadowX: '4px',      // 悬停时 X 轴移动距离
        boxShadowY: '4px',      // 悬停时 Y 轴移动距离
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
    },
  },
}
```

---

## 设计原则

### Neobrutalism 风格特点

1. **大胆的边框** - 使用 2px 的黑色边框
2. **明显的阴影** - 4x4px 的纯色阴影
3. **高对比度** - 明确的颜色区分
4. **平面设计** - 无渐变效果
5. **动态交互** - 悬停时阴影移动

### 使用建议

1. **视觉层级**：
   - Primary Action: `variant="default"` + `size="lg"`
   - Secondary Action: `variant="neutral"` + `size="default"`
   - Tertiary Action: `variant="noShadow"` + `size="sm"`

2. **颜色搭配**：
   - 主色调 (`--main`): 用于突出操作
   - 白色 (`--bw`): 用于中性操作
   - 保持高对比度以确保可读性

3. **布局间距**：
   - 按钮之间使用 `gap-3` (12px)
   - 按钮组使用 `flex` 布局
   - 响应式布局考虑按钮堆叠

---

## 无障碍 (Accessibility)

### 键盘导航

- `Tab`: 聚焦到按钮
- `Enter` / `Space`: 触发按钮点击
- 聚焦时显示 2px 黑色焦点环

### 屏幕阅读器

- 使用语义化的 `<button>` 元素
- 确保按钮有清晰的文本标签
- 图标按钮添加 `aria-label`

```tsx
<NeoButton size="icon" aria-label="添加新项目">
  <Plus className="w-4 h-4" />
</NeoButton>
```

---

## 性能优化

1. **动画性能**：使用 `transform` 而非 `position` 实现动画
2. **状态管理**：按钮状态通过 CSS 管理，无需 JavaScript
3. **懒加载**：图标组件按需加载

---

## 常见问题

### Q: 按钮阴影不显示？
**A**: 确保已在 `globals.css` 中添加 CSS 变量定义。

### Q: 深色模式下按钮看不清？
**A**: 检查 `.dark` 类下的 CSS 变量配置。

### Q: 想要更大的阴影效果？
**A**: 修改 `tailwind.config.js` 中的 `boxShadowX` 和 `boxShadowY` 值。

### Q: 如何禁用悬停动画？
**A**: 使用 `variant="noShadow"` 变体。

---

## 迁移指南

### 从标准按钮迁移

**之前**:
```tsx
<button className="px-4 py-2 bg-black text-white rounded-lg">
  Click me
</button>
```

**之后**:
```tsx
<NeoButton variant="default">
  Click me
</NeoButton>
```

### 批量替换

在 Composer、Schedule、Dashboard、Media 页面中：

1. 导入 NeoButton: `import { NeoButton } from '@/components/ui/neo-button'`
2. 替换主要操作按钮: `variant="default"`
3. 替换次要操作按钮: `variant="neutral"` 或 `variant="noShadow"`
4. 调整尺寸: 使用 `size` 属性

---

## 相关资源

- [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [Class Variance Authority](https://cva.style/)
- [Neobrutalism Design](https://brutalist-web.design/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 更新日志

### v1.0.0 (2025-01-20)
- ✨ 初始版本发布
- 🎨 四种按钮变体
- 📏 四种尺寸选项
- 🌓 深色模式支持
- ♿ 无障碍优化