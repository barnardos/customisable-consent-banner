module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-console': [
      'error',
      {
        allow: ['error']
      }
    ],
    'yoda': [
      'error',
      'never'
    ],
    'camelcase': [
      'error'
    ],
    'brace-style': [
      'error',
      '1tbs'
    ],
    'block-spacing': [
      'error',
      'always'
    ],
    'capitalized-comments': [
      'error',
      'always'
    ],
    'comma-spacing': [
      'error',
      {
        'before': false,
        'after': true
      }
    ],
    'comma-style': [
      'error',
      'last'
    ],
    'computed-property-spacing': [
      'error',
      'never'
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'key-spacing': [
      'error',
      {
        'beforeColon': false,
        'afterColon': true,
        'mode': 'strict'
      }
    ],
    'keyword-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'max-statements-per-line': [
      'error',
      {
        'max': 1
      }
    ],
    'no-lonely-if': [
      'error'
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1
      }
    ],
    'no-trailing-spaces': [
      'error'
    ],
    'object-curly-newline': [
      'error',
      {
        'ObjectExpression': 'always',
        'ObjectPattern': 'never'
      }
    ],
    'spaced-comment': [
      'error',
      'always'
    ]
  }
};
