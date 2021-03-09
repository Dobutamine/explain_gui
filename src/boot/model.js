import { Model } from 'app/public/model'

// eslint-disable-next-line prefer-const
let model = new Model()

export default ({ Vue }) => {
  Vue.prototype.$model = model
}

export { model }
