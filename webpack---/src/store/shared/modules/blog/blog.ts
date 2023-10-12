import Vue from 'vue'
import { Commit } from 'vuex'
import LoadableModel from '@/models-ts/LoadableModel'
import LoadablePageModel from '@/models-ts/LoadablePageModel'
import Post, { PostFromServer } from '@/models-ts/blog/Post'
import { getPost, getList } from '@/api/blog'
import { IBlogState } from './types'

const getInitialState = (): IBlogState => ({
  lastPostsData: [],
  postData: {},
  blog: new LoadablePageModel<PostFromServer>(),
  mainPost: null,
  prefetched: false,
})

export default () => {
  return {
    namespaced: true,
    state: getInitialState(),
    getters: {
      lastPosts: (state: IBlogState) => state.lastPostsData.map(Post.fromServer),
      posts: (state: IBlogState) => (state.blog.values && state.blog.values.map(Post.fromServer)) || [],
      post: (state: IBlogState) => (index: number) => state.postData[index]?.value ? Post.fromServer(state.postData[index].value) : null,
      postIsLoading: (state: IBlogState) => (index: number) => state.postData[index]?.isLoading,
      postIsLoaded: (state: IBlogState) => (index: number) => state.postData[index]?.isLoaded,
      mainPost: (state: IBlogState) => state.mainPost ? Post.fromServer(state.mainPost) : null,
    },
    mutations: {
      beforeReady (state: IBlogState) {
        state.blog = new LoadablePageModel(state.blog)
      },
      setPostsLoading (state: IBlogState) {
        state.blog.loading()
      },
      setPostsLoaded (state: IBlogState, data: any) {
        state.blog.loaded(data)
      },
      setLastPostsData (state: IBlogState, posts: Array<PostFromServer>) {
        state.lastPostsData = posts
      },
      setMainPost (state: IBlogState, post: PostFromServer) {
        state.mainPost = post
      },
      setPostDataLoading (state: IBlogState, { slug }: { slug: string }) {
        if (!state.postData[slug]) {
          Vue.set(state.postData, slug, new LoadableModel())
        }
        state.postData[slug].loading()
      },
      setPostDataLoaded (state: IBlogState, { post }: { post: PostFromServer }) {
        if (state.postData[post.url]) {
          state.postData[post.url].loaded(post)
        }
      },
      setPrefetched (state: IBlogState, flag: boolean) {
        state.prefetched = flag
      },
    },
    actions: {
      async getPosts (
        { commit, state }: { commit: Commit, state: IBlogState },
        { limit = 98, offset = 0 } = {}
      ) {
        try {
          commit('setPostsLoading')
          const { pagination, blog } = await getList(limit, offset)
          commit('setPostsLoaded', { pagination, values: blog })
        } catch (e) {
          console.log(e)
          commit('setPostsLoaded', state.blog)
          throw e
        }
      },
      async getOtherPosts ({ commit, state }: { commit: Commit, state: IBlogState }) {
        try {
          const { blog } = await getList(6, 0)
          commit('setLastPostsData', blog)
        } catch (e) {
          console.log(e)
          commit('setLastPostsData', state.lastPostsData)
          throw e
        }
      },
      async getMainPost ({ commit }: { commit: Commit }) {
        try {
          const { blog } = await getList(1, 0)
          commit('setMainPost', blog[0])
        } catch (e) {
          console.log(e)
          throw e
        }
      },
      async getPost ({ commit }: { commit: Commit }, slug: string) {
        try {
          commit('setPostDataLoading', { slug })
          const details = await getPost(slug)
          commit('setPostDataLoaded', { post: details })
        } catch (e) {
          commit('setPostData', { slug, post: null })
          throw e
        }
      }
    },
  }
}
