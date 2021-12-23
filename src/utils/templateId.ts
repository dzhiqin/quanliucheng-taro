import custom from '@/custom/index'

const hospName = custom.hospName
export const longtermTemplates = {
  // 就诊提醒和待缴费提醒
  treatmentAndPayment: () => {
    let tempIds = []
    switch (hospName) {
      case 'hzfy':
        tempIds = ['hC5Utd2s9XPqcNh-smxluapbzA5bQoY8QiIDfuukOAE']
        break
      case 'lwgk':
        tempIds = ['4RckgEP-B5zFYHkMDdrSvmB1unuU7LDhH9ZGf4MJ0eI', 'nJMfTeNcCIRAOC3agtrH2sEw_rb9MQXVC2eK0dEJgvM', '1Y7Iu0-grEtMsexRhqB1Q4cHgTspOggU5Y6bhufypaI']
        break
      case 'jayy':
        tempIds = ['zLSrCmv8JJW4t6aWO8qBGK0Z1kR2aHW5fmNxo3KzE3Q','9CpAcDEV4hmz_c3SIRu0-Al9dE0fBd_cfvf2ykqadnc','oDZ3NDPB_-YEy6nkEKuxcjr_q8Rp0C7G9PFCpuVLPfU']
        break
      case 'epfy':
        tempIds = ['bSRjI78XTOZypmNQrXjjdvP8S8EoFmKpXXUIUPevuOI','7K1_PxerIwdUR6AAMkW_toK5kcwAxRkA3dYsjiSzfRw','Kw34uIwJA3OJkX8gFLWvVV_eIKzymIniLGLoaQdIlBA']
        break
      case 'gysy':
        tempIds = ['k122ACPjHdkS6ZSo3fuYpj1bmSiQtHm2J3k3eyXTONU','KeFqSb4P0naN2T8j6J5K0fQgL6MojhynSiVPrCZixoA','Xn1tFWS0H10H_RQv3tvURNceOzsFnXqd7-3zn04nESs']
        break
      case 'gysylw':
        tempIds = ['z5DIZhdEj9DCvfKRheU06kKod6r55bx1LC8p2VsB_O4','A8GTcQvlKDqEDSi1u19RFwKqRjrPJwW4feHMuvpZNso','M8e0Dbtb87M8DUXYPwTQdOxnz8sddpCkc_r7_VMd2Jc']
        break
    }
    return tempIds
  },
}
export const onetimeTemplates = {
  bindCard: () => {
    let tempIds = []
    switch (hospName) {
      case 'hzfy':
        tempIds = ['Pj4XnExuaPWlwHB0M6yYFT8Dm8ZQeocewTsoSyWbcPg']
        break
      case 'lwgk':
        tempIds = ['RSVR4k_LMfDqiQ7Dd4xkc3hdqam-tGj0-u2U7IxOr-M']
        break
      case 'jayy':
        tempIds = ['SZZ2d3Vd-joljgDOFWNtjKxyV1PfGxC4QUelqitlTdE']
        break
      case 'epfy':
        tempIds = ['mDsWRqLTRkErrhEi9buU2Fdtei6DQZTYd1L47px7WhU']
        break
      case 'gysy':
        tempIds = ['XdXvsxVVjBeXvGKDkN0sb4_IUKmz5-M9vVo5VvJQA30']
        break
      case 'gysylw':
        tempIds = ['KDkqTgWPR8SUOnWTu-QS8LPBcTPrB121kHuHOFPcRjY']
        break
    }
    return tempIds
  },
  // 挂号（挂号成功，挂号取消，退费提醒）
  registration: () => {
    let tempIds = []
    switch (hospName) {
      case 'hzfy':
        tempIds = []
        break
      case 'lwgk':
        tempIds = ['jh9Xi4Jt1kQ3ypscIy_9u-mImT9wwKp7zkMSO_zBCk8', 'Ui8MCcOjbu6vLSk1KD5U_eaBeQeYMKX-ghGb9LKYB9Q', 'LbSvzH4CbYtgOIOESN4fAS8jCn3hZH_D2wTYE1mA-j4']
        break
      case 'jayy':
        tempIds = ['6P8zfCAbaN9PMv6ZPivqaFgW6SPPzSDlIA3udO362Pk','1-X3_PZlN5uko1RXdFcUhSlvep9Y9wWHPn1MBk8nGa0','vnSTkAGWrjDfAKNmZ5apLLaiqBlgns77lLiGdDOiRJo']
        break
      case 'epfy':
        tempIds = ['e0FDjk3sWMLKIdu91xKfeOoSZc87JSDjOEmaT7Aq8RQ','xh0vmL6oGpjiM6el5JmgyZfo4gZFvMcRFr_R5eXsNSg','NdfPzIXyqwkEnCRI_dn67KbG79fZsVjaXlrVstAjC1A']
        break
      case 'gysy':
        tempIds = ['lMk0FYfb_9Ab0h4OgQ4vMFzre19DvBJeNB4RY_CWQvA','wh0LadWFSyzjo_u292XgUU66KieDEMR_H-CLQ65Ir54','gDVRne-Bq2dHWrxfeR_63xRA_c-eRhcws1_Cd_r43_4']
        break
      case 'gysylw':
        tempIds = ['KB2AIUyjvp209JGNy-7EtKDSK4N2fgwfpbaMazZsclA','MlDidLtES5vVTC4YcGIhYluIMIXSi7hX3JXngkgUV7s','Hhj5lSuAslXx5VGEbhfp2KAiSw__Qv3_B3_1i16qt5o']
        break
    }
    return tempIds
  },
  // 门诊缴费（缴费成功，退费提醒）
  payment: () => {
    let tempIds = []
    switch (hospName) {
      case 'hzfy':
        tempIds = []
        break
      case 'lwgk':
        tempIds = ['JQvwUruyBZSNoWmyPb-DurwKwRax2PB_Rzhg4TyM6x8', 'LbSvzH4CbYtgOIOESN4fAS8jCn3hZH_D2wTYE1mA-j4']
        break
      case 'jayy':
        tempIds = ['34InUe4hYzcUsLANM1tACXX4Rv8cXqAbOKLtOpZljow','vnSTkAGWrjDfAKNmZ5apLLaiqBlgns77lLiGdDOiRJo']
        break
      case 'epfy':
        tempIds = ['kDLSFZPddBJ4LLo3JsSU8oqwXh0GkBWKEeX0EFTkTrY','NdfPzIXyqwkEnCRI_dn67KbG79fZsVjaXlrVstAjC1A']
        break
      case 'gysy':
        tempIds = ['isQ25COANNHUoeapnheDkG_A0BP_meM2VVz1g7haT6U','gDVRne-Bq2dHWrxfeR_63xRA_c-eRhcws1_Cd_r43_4']
        break
      case 'gysylw':
        tempIds = ['F5gOTB-fPJ0y5QG94_QQ0MUxaxJ0cIl1eA_NBNlQ4wk','Hhj5lSuAslXx5VGEbhfp2KAiSw__Qv3_B3_1i16qt5o']
        break
    }
    return tempIds
  }
}