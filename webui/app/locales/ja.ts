// src/locales/ja.ts
const ja = {
  common: {
    login: 'ログイン',
    logout: 'ログアウト',
    language: '言語',
    start: '開始時間',
    end: '終了時間',
    refresh: '更新',
    username: 'ユーザー名',
    password: 'パスワード',
    rememberMe: 'ログイン状態を保持',
    forgotPassword: 'パスワードをお忘れですか？',
    loggingIn: 'ログイン中…',
  },
  dashboard: {
    title: '産業ゲートウェイ監視ダッシュボード',
    runningTrend: '運転トレンド',
    alarmList: '最新アラーム',
    more: 'もっと見る',
    alarmLevel: 'レベル',
    device: 'デバイス',
    alarmMsg: 'アラーム内容',
    time: '時刻',
  },
  device: {
    list: 'デバイス一覧',
  },
  maintenance: {
    deviceTerminal: 'デバイス端末',

    overviewDesc:
      '保守概要では、ゲートウェイの稼働状態、主要サービスおよび基本情報を表示します。データは {seconds} 秒ごとにバックエンドから取得され、CPU / メモリ使用率は直近 {points} 個のサンプルで集計されます。',
    uptimeTitle: 'システム稼働時間',
    uptimeHint:
      'ゲートウェイの実際の稼働時間をバックエンドから取得し、{seconds} 秒ごとに更新します。',
    cpuMemTitle: 'CPU / メモリ',
    cpuMemValue: 'CPU: {cpu}、メモリ: {mem}',
    cpuMemHint:
      '直近 {points} 個のサンプル（{seconds} 秒ごとに取得）でトレンドを確認します。',
    serviceTitle: 'サービス状態',
    serviceHint:
      'Modbus、MQTT、北向きインターフェースなどの主要サービスの状態を {seconds} 秒ごとに更新します。',
    noService: 'サービス状態データはまだ取得されていません。',
    logTitle: '保守操作ログ',
    logHint:
      'サービス再起動、ファームウェアのアップグレード、端末ログインなど、最近の保守操作をここに表示できます。',

    cpuLegend: 'CPU',
    memLegend: 'メモリ',

    serviceStatus: {
      up: '正常',
      degraded: '低下',
      down: '異常',
    },

    uptimeDays: '{days} 日',
    uptimeHours: '{hours} 時間',
    uptimeMinutes: '{minutes} 分',
    uptimeSeconds: '{seconds} 秒',
  },
  app: {
    footer: 'Industrial Gateway Console',
  },
  login: {
    title: '産業ゲートウェイコンソール',
    subtitle: 'Industrial Gateway Console',
    username: 'ユーザー名',
    usernamePlaceholder: 'ユーザー名を入力してください',
    password: 'パスワード',
    passwordPlaceholder: 'パスワードを入力してください',
    rememberMe: 'ログイン状態を保持',
    submit: 'ログイン',
    missingCredentials: 'ユーザー名とパスワードを入力してください',
    success: 'ログインに成功しました',
    failed: 'ログインに失敗しました。ユーザー名とパスワードを確認してください',
  },
}

export default ja