// for transpiling all ESM @fullcalendar/* packages
// also, for piping fullcalendar thru babel (to learn why, see babel.config.js)
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/timeline',
  '@fullcalendar/resource-timeline',
  '@fullcalendar/daygrid',
  '@fullcalendar/daygrid'
])

module.exports = withTM({
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  }
})
