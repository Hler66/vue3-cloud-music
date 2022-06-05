import { createRouter,createWebHistory } from 'vue-router';
import Home from '../application/Home/Home.vue';
import Rank from '../application/Rank/Rank.vue';
import Recommend from '../application/Recommend/Recommend.vue';
import Singers from '../application/Singers/Singers.vue'
import Ablum from '../application/Ablum/Ablum.vue'
import Singer from '../application/Singer/Singer.vue'

const routes = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:Home,
            redirect:'/recommend',
            children:[
                {
                    path:'/rank',
                    component:Rank
                },
                {
                    path:'/singers',
                    component:Singers
                },
                {
                    path:'/recommend',
                    component:Recommend,
                    exact:true,
                },
                {
                    path:'/recommend/:id',
                    component:Ablum
                },
                {
                    path:'/rank/:id',
                    component:Ablum
                },
                {
                    path:'/singers/:id',
                    component:Singer
                }
            ],
        },
        // {
        //     path:'/recommend/:id',
        //     component:Ablum
        // },
        // {
        //     path:'/rank/:id',
        //     component:Ablum
        // },
        // {
        //     path:'/singers/:id',
        //     component:Singer
        // }
    ]
})

export default routes