// src/locales/en.ts
const en = {
  common: {
    login: 'Login',
    logout: 'Logout',
    language: 'Language',
    start: 'Start',
    end: 'End',
    refresh: 'Refresh',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    loggingIn: 'Logging in…',
    about:"Info",
  },
  dashboard: {
    title: 'Industrial Gateway Dashboard',
    runningTrend: 'Running Trend',
    alarmList: 'Latest Alarms',
    more: 'More',
    alarmLevel: 'Level',
    device: 'Device',
    alarmMsg: 'Alarm Message',
    time: 'Time',
  },
  device: {
    list: 'Device List',
  },
  maintenance: {
    deviceTerminal: 'Device Terminal',

    overviewDesc:
      'The maintenance overview shows the current system status, key services, and basic information. Data is fetched from the backend every {seconds} seconds, and CPU / memory usage is aggregated over the latest {points} points.',
    uptimeTitle: 'System Uptime',
    uptimeHint:
      'Gateway uptime fetched from backend, updated every {seconds} seconds.',
    cpuMemTitle: 'CPU / Memory',
    cpuMemValue: 'CPU: {cpu}, Memory: {mem}',
    cpuMemHint:
      'Last {points} samples (collected every {seconds} seconds) for trend observation.',
    serviceTitle: 'Service Status',
    serviceHint:
      'Shows the status of key services such as Modbus, MQTT, and northbound interfaces, updated every {seconds} seconds.',
    noService: 'No service status data available yet.',
    logTitle: 'Maintenance Operation Logs',
    logHint:
      'You can show recent maintenance operations here, such as service restart, firmware upgrade, and terminal logins.',

    cpuLegend: 'CPU',
    memLegend: 'Memory',

    serviceStatus: {
      up: 'Healthy',
      degraded: 'Degraded',
      down: 'Down',
    },

    uptimeDays: '{days} day(s)',
    uptimeHours: '{hours} hour(s)',
    uptimeMinutes: '{minutes} minute(s)',
    uptimeSeconds: '{seconds} second(s)',
  },
  app: {
    footer: 'Industrial Gateway Console',
  },
  login: {
    title: 'Industrial Gateway Console',
    subtitle: 'Industrial Gateway Console',
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    rememberMe: 'Remember me',
    submit: 'Sign in',
    missingCredentials: 'Please input username and password',
    success: 'Login successful',
    failed: 'Login failed, please check your credentials',
  },
}

export default en