import Vue from 'vue'
import Router from 'vue-router'
import Editor from '@/components/Editor'
import EditorWithoutZoneViewer from '@/components/EditorWithoutZoneViewer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/x1/:x1/y1/:y1/x2/:x2/y2/:y2', 
      name:"Editor",
      component: Editor
    },
    {
      path: '/',
      name: 'Editor1',
      component: Editor
    }
  ]
})
