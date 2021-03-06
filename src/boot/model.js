import { Model } from 'app/public/model'

// eslint-disable-next-line prefer-const
let model = new Model('normal_neonate')
// const model = new Model('normal_pregnant')

export default ({ Vue }) => {
  Vue.prototype.$model = model
}

export { model }
