<script>
    import { reactive } from 'vue'
    import emojis from '../js/emojis'
    export default {
        data(){
            return {
                emoji: reactive({value: '😭'})
            }
        },
        methods: {
            emojiRandom()
            {
                const num = Math.floor(Math.random() * emojis.length)
                this.emoji.value = emojis[num]
            }
        }
    }

</script>
<template>
    <div id="notFound">
        <b>404</b>
        <p>Не найдено <button @click="emojiRandom()" id="emoji">
            <transition name="base" mode="out-in">
                <span reactive="emoji" :key="emoji.value">{{ emoji.value }}</span>
            </transition>
        </button></p>
        <router-link to="/"><button id="home">На главную</button></router-link>
    </div>
</template>
<style scoped>
.base-leave-active {
  transition: all 0.05s linear;
}

.base-enter,
.base-leave-to {
  opacity: 0;
}
#emoji span
{
    margin: auto;
    font-size: 1.8rem;
    max-width: 100%;
    max-height: 100%;
    line-height: 100%;
    text-align: center;
}
#notFound
{
    width: fit-content;
    position: absolute; 
    left: 0; 
    right: 0; 
    top: 10rem;
    margin: auto;
}

b
{
    font-size: 15rem;
}
p
{
    
    position: relative;
    top: -3rem;
    font-size: 2rem;
    white-space: nowrap;
    font-weight: 200;
    color: #ff79c6;
}
#home
{
    
    outline: none;
    border: 0.1rem solid #6272a4;
    background-color: #44475a;
    padding: 1.2rem;
    border-radius: 1rem;
    width: 10rem;
    left:0;
    right:0;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
}
#home:hover
{
    background-color: #6a6e85;
}

#home:active
{
    border: 0.1rem solid #50fa7b;
}
#emoji
{
    width: 3.5rem;
    height: 3.5rem;
    line-height: 3.5rem;
    /* padding: 2rem; */
    text-align: center;
    cursor: pointer;
    font-size: 2rem;
    outline: none;
    border: none;
    background: #ff5555;
    border-radius: 1rem;
}
</style>