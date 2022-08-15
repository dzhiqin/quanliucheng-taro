type HospName = 
  'guang_san_li_wan' |
  'en_ping_fu_you' |
  'li_wan_gu_ke' |
  'shun_de_jun_an' | 
  'jin_sha_zhou'
const hospName:HospName = 'guang_san_li_wan'
const hospConfig = require(`./hosp-config/${hospName}`)

export const custom = hospConfig.default