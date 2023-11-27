const config = {
    collectCoverage: true,
    coverageReporters: ['text', 'cobertura'],
    setupFilesAfterEnv: ['./tests/setup.js'],
};

module.exports = config;
