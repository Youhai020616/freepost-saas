import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ 保留 Tailwind 默认颜色
        purple: colors.purple,
        blue: colors.blue,
        green: colors.green,
        // 自定义颜色
        main: 'var(--main)',
        overlay: 'var(--overlay)',
        bg: 'var(--bg)',
        bw: 'var(--bw)',
        blank: 'var(--blank)',
        text: 'var(--text)',
        mtext: 'var(--mtext)',
        border: '#000000',
        ring: 'var(--ring)',
        ringOffset: 'var(--ring-offset)',
        secondaryBlack: '#212121',
      },
      borderRadius: {
        base: '5px'
      },
      boxShadow: {
        shadow: '4px 4px 0px 0px #000000',
        'shadow-dark': '4px 4px 0px 0px #ffffff',
      },
      textShadow: {
        sm: 'var(--text-shadow-sm)',
        md: 'var(--text-shadow-md)',
        lg: 'var(--text-shadow-lg)',
        xl: 'var(--text-shadow-xl)',
        none: 'none',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
    },
  },
  plugins: [
    function ({ matchUtilities, theme }: {
      matchUtilities: (
        utilities: Record<string, (value: string) => Record<string, string>>,
        options: { values: Record<string, string> }
      ) => void;
      theme: (key: string) => Record<string, string>;
    }) {
      matchUtilities(
        {
          'text-shadow': (value: string) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
};

export default config;
