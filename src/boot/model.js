import { Model } from 'app/public/model'

// eslint-disable-next-line prefer-const
let model = new Model('normal_neonate')

export default ({ Vue }) => {
  Vue.prototype.$model = model
}

export { model }
