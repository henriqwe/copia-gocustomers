module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '!src/utils/apollo.ts'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts(x)?',
    '!src/**/stories.tsx',
    '!src/styles/**/*.ts(x)?'
  ],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup.ts'],
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '^&/(.*)$': ['<rootDir>/src/components/dominios/$1'],
    '^&R/(.*)$': ['<rootDir>/src/components/dominios/rastreamento/$1'],
    '^&A/(.*)$': ['<rootDir>/src/components/dominios/assistencia/$1'],
    '^&M/(.*)$': ['<rootDir>/src/components/dominios/maxline/$1'],
    '^@/(.*)$': ['<rootDir>/src/components/$1']
  }
}
