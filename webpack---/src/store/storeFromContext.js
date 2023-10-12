import Vue from 'vue'
import get from 'lodash/get'

export default function() {
    return get(Vue, 'prototype.$context.store')
}