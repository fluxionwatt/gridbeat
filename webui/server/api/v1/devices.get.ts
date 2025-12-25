export default defineEventHandler((event) => {
  const auth = getHeader(event, 'authorization') || ''
  if (!auth.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return [
    { id: 'd-1', name: 'Inverter-01', protocol: 'modbus-tcp', online: true },
    { id: 'd-2', name: 'Meter-01', protocol: 'modbus-rtu', online: false },
  ]
})