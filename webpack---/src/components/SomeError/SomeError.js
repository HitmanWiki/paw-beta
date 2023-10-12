// eslint-disable-next-line import/no-webpack-loader-syntax
import errorCircle from '!!raw-loader!./error-circle.svg'

export default {
    name: 'lx-some-error',
    data() {
        return {
            errorCircle,
        }
    },
}