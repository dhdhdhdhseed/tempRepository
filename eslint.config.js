import antfu from '@antfu/eslint-config'

export default antfu(
  {
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'curly': ['error', 'all'], // 强制要求在所有条件语句中使用大括号 {}
      'ts/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
      }],
    },
  },
  // vue文件代码块排序
  {
    files: [
      'src/**/*.vue',
    ],
    rules: {
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style'],
      }],
    },
  },
)
