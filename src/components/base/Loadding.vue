<template>
<!-- 龙哥的加载动画 -->
    <div class="load-warp">
        <div class="route-warp">
            <div class="move-box t"></div>
            <div class="move-box l"></div>
            <div class="move-box b"></div>
            <div class="move-box r"></div>
        </div>
    </div>
</template>
<script>
export default {
    name:"loadding"
}
</script>
<style lang="scss" scoped>
.load-warp {
    width:50px;
    height:50px;
    position:relative;
}
.route-warp {
    position: absolute;
    animation: rotate 4s infinite;
    transform-origin:center center;
    transform: translate(-50%,-50%) scale(0.6,0.6);
    transform-origin:center center;
}
.load-warp .move-box {
    width:50px;
    height:10px;
    position: absolute;
    border-radius:10px;
    animation: myfirst 1s infinite;
    display:block;
}
.route-warp {
    position:absolute;
    width:100%;
    height:100%;
}
.load-warp .move-box.t {
    top: -5px;
    left: 34px;
    transform: rotateZ(135deg);
    transform-origin: left center;
    background: #1fb19e;
    z-index: 4;
}
.load-warp .move-box.b {
    bottom: -5px;
    left: 15px;
    transform: rotateZ(-44deg);
    transform-origin: left center;
    background: #ffc339;
    z-index: 2;
}

.load-warp .move-box.l {
    left: -1px;
    top: 12px;
    transform: rotateZ(45deg);
    transform-origin: left center;
    background: #eb4c44;
    z-index: 3;
}

.load-warp .move-box.r {
    right: 1px;
    top: 28px;
    transform-origin: right center;
    transform: rotateZ(45deg);
    background: #4c4c4c;
    z-index: 3;
}
@-webkit-keyframes myfirst /* Safari 和 Chrome */
{
    0%{
        width:10px;
    }
    25% {
        width:10px;
    }
    50%{
        width:50px;
    }
    75%{
        width:10px;
    }
    100%{
        width:10px;
    }
}
@-webkit-keyframes radius /* Safari 和 Chrome */
{
    0%{
        border-radius:10px;
    }
    25% {
        border-radius:10px;
    }
    50%{
        border-radius:0px 10px 10px 0px;
    }
    75%{
        border-radius:10px;
    }
    100%{
        border-radius:10px;
    }
}
/**/
@-webkit-keyframes rotate {
    0%{
        transform:rotateZ(0deg);
    }
    12.5%{
        transform:rotateZ(0deg);
    }
    25%{
        transform:rotateZ(-90deg);
    }
    37.5%{
        transform:rotateZ(-90deg);
    }
    50%{
        transform:rotateZ(-180deg);
    }
    62.5%{
        transform:rotateZ(-180deg);
    }
    75%{
        transform:rotateZ(-270deg);
    }
    87.5%{
        transform:rotateZ(-270deg);
    }
    100%{
        transform:rotateZ(-360deg);
    }
}
</style>
