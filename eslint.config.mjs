// Flat config ESLint
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import unused from 'eslint-plugin-unused-imports'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['**/dist', '**/build', '**/node_modules', '**/.vite', '**/.turbo'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': hooks,
      import: importPlugin,
      'unused-imports': unused,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/unified-signatures': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/order': [
        'warn',
        { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], 'newlines-between': 'always' },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  }
)
