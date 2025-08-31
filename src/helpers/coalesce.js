module.exports = (...args) => {
  for (const v of args) if (v !== undefined && v !== null && v !== '' && v !== false) return v
  return undefined
}
