import { Model } from 'app/public/model'

const model = new Model('normal_neonate')

export default ({ Vue }) => {
  Vue.prototype.$model = model
}

export { model }
