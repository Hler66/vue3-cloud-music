import { createStore } from "vuex";
import Recommend from '../application/Recommend/store/index'
import Singers from '../application/Singers/store/index'
import Rank from '../application/Rank/store/index'
import Ablum from '../application/Ablum/store/index'
import Singer from '../application/Singer/store/index'
import createPersistedState from "vuex-persistedstate";
import Player from '../application/Player/store/index'

export const store = createStore({
    state:{},
    actions:{},
    mutations:{},
    getters:{},
    modules:{
        Recommend,
        Singers,
        Rank,
        Ablum,
        Singer,
        Player
    },
    plugins: [createPersistedState({storage: window.sessionStorage,paths:['Recommend','Singers','Rank','Ablum','Singer','Player']})],
})