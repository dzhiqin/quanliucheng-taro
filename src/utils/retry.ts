const delay = (mileSeconds = 1000) =>{
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, mileSeconds);
  })
}
const recursion = (promise, resolve, reject, count, totalCount) => {
  delay().then(() => {
    promise().then((res) => {
      resolve(res)
    }).catch(err => {
      if(count >= totalCount){
        reject(err)
        return
      }
      recursion(promise, resolve, reject, count+1, totalCount)
    })
  })
}
export const requestTry = (promise, totalCount) => {
  return new Promise((resolve,reject) => {
    let count = 1
    promise().then(res => {
      resolve(res)
    }).catch(err => {
      if(count >= totalCount){
        reject(err)
        return
      }
      recursion(promise, resolve, reject, count +1, totalCount)
    })
  })
}