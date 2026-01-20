module.exports = {
    verbose: true,
    coverageReporters: ['html', 'text', 'cobertura'],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/src/**/*.test.mjs', '<rootDir>/src/**/*.spec.js', '<rootDir>/src/**/*.spec.mjs'],
    moduleFileExtensions: ['js', 'mjs'],
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.cjs'],
    moduleNameMapper: {
        '^@arpadroid/tools-iso$': '<rootDir>/src/index.js',
        '^@arpadroid/tools-iso/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.m?js$': ['babel-jest', { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] }]
    },
    fakeTimers: { enableGlobally: true },
    injectGlobals: true,
    globals: {},
    transformIgnorePatterns: [
        'node_modules/(?!(@arpadroid|chokidar|readdirp|anymatch|normalize-path|picomatch|glob-parent|braces|fill-range|to-regex-range|is-number|is-extglob|is-glob|chalk|glob|minimatch|yargs|yargs-parser)/)'
    ],
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputName: 'junit.xml'
            }
        ]
    ]
};
