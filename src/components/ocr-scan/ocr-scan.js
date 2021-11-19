/* eslint-disable no-undef */
import photoPath from '../../images/icons/photo.png'

Component({
  data: {
    photoUrl: photoPath
  },
  methods: {
    onSuccess(e){
      console.log('onsuccess',e)
      this.triggerEvent('success',e.detail)
    }
  }
})