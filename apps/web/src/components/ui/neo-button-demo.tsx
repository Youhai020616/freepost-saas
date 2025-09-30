import { NeoButton } from "@/components/ui/neo-button"
import { Send, Save, Eye, Upload, Plus } from "lucide-react"

/**
 * NeoButton 演示组件
 * 展示所有按钮变体和使用示例
 */

// 默认按钮 - 带阴影和悬停动画
export const Default = () => (
  <NeoButton>
    <Send className="w-4 h-4" />
    Publish Now
  </NeoButton>
)

// Reverse 按钮 - 反向阴影效果
export const Reverse = () => (
  <NeoButton variant="reverse">
    <Upload className="w-4 h-4" />
    Upload Media
  </NeoButton>
)

// NoShadow 按钮 - 无阴影扁平效果
export const NoShadow = () => (
  <NeoButton variant="noShadow">
    <Eye className="w-4 h-4" />
    Preview
  </NeoButton>
)

// Neutral 按钮 - 中性色彩方案
export const Neutral = () => (
  <NeoButton variant="neutral">
    <Save className="w-4 h-4" />
    Save Draft
  </NeoButton>
)

// 不同尺寸示例
export const Sizes = () => (
  <div className="flex items-center gap-4">
    <NeoButton size="sm">
      <Plus className="w-4 h-4" />
      Small
    </NeoButton>
    <NeoButton size="default">
      <Plus className="w-4 h-4" />
      Default
    </NeoButton>
    <NeoButton size="lg">
      <Plus className="w-4 h-4" />
      Large
    </NeoButton>
  </div>
)

// 仅图标按钮
export const IconOnly = () => (
  <NeoButton size="icon" variant="default">
    <Plus className="w-4 h-4" />
  </NeoButton>
)

// 禁用状态
export const Disabled = () => (
  <NeoButton disabled>
    <Send className="w-4 h-4" />
    Disabled
  </NeoButton>
)

// 所有变体展示
export const AllVariants = () => (
  <div className="space-y-4 p-8 bg-slate-50 dark:bg-slate-900 rounded-xl">
    <h3 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
      NeoButton Variants
    </h3>

    <div className="space-y-3">
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Default - 主要操作按钮</p>
        <Default />
      </div>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Neutral - 中性操作按钮</p>
        <Neutral />
      </div>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">NoShadow - 次要操作按钮</p>
        <NoShadow />
      </div>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Reverse - 反向动画效果</p>
        <Reverse />
      </div>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Sizes - 不同尺寸</p>
        <Sizes />
      </div>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Icon Only - 仅图标</p>
        <IconOnly />
      </div>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Disabled - 禁用状态</p>
        <Disabled />
      </div>
    </div>
  </div>
)

export default AllVariants
