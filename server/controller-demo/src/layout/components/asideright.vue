<template>
    <div v-show="isShow" class="aside-div" ref="mainAside" :class="{'aside-div-long': longShow}"
         @mouseout="out($event)">
        <div class="out-btn" :class="{'out-btn-hide':longShow}">
            <el-row>
                <el-button type="primary" icon="el-icon-phone-outline" @click="open"></el-button>
            </el-row>
            <el-row>
                <el-button type="danger" icon="el-icon-close" @click="close"></el-button>
            </el-row>
        </div>
        <div class="aside-div-main">
            <el-row>
                <audio
                    ref="recordingSearchAudio"
                    controls
                    autoplay
                    _controlsList="nodownload"
                >
                    <!--                  <source src="https://crmgateway.msxfcloud.test/icc/getCallRecordsByRecordId?recordId=795f9565-35d7-4ee4-b43c-d3c87fe2550f&recordDate=1591000961312" type = "audio/mpeg"> -->
                    <source ref="audiosource" :src="audioUrl" type="audio/mpeg">
                </audio>
            </el-row>
            <el-button-group>
                <el-button type="primary" @click="handleChangeSpeed('slow')">慢速</el-button>
                <el-button type="primary" @click="handleChangeSpeed('normal')">正常</el-button>
                <el-button type="primary" @click="handleChangeSpeed('quickly')">快速</el-button>
            </el-button-group>
            <el-button type="danger" @click="close">关闭</el-button>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'asideright',
        computed: {
            ...mapGetters([
                'recordData'
            ]),
        },
        data() {
            return {
                isShow: false,
                longShow: false,
                dialogVisible: true,
                audioUrl: '',
                teamList: [],
                isLoad: false,
                isOnePlay: true
//                recordData: {}
            }
        },
        watch: {
            'recordData': {
                handler: function (val, oldVal) {
                    var self = this;
                    var audisDom = self.$refs.recordingSearchAudio;
//                    console.log('recordData')
                    //console.log(val)
                    if (val.searchUrl) {
                        this.isShow = true;
                        if (val.searchUrl != this.audioUrl) {
                            self.durationchange = false;
                            //console.log("aside  recordData +++ val:",val);
                            self.audioUrl = val.searchUrl;
                            self.$nextTick(() => {
                                audisDom.load();
                                audisDom.play();
                            });
                        }
                        // 设置播放速度
                        if (val.playbackRate != this.playbackRate) {
                            this.playbackRate = val.playbackRate;
                            //console.log('playbackRate', val.playbackRate)
                            audisDom.playbackRate = val.playbackRate || 1;
                        }
                        if(val.toPlayTime == 'setplay'){

                            audisDom.currentTime = +val.currentTime
                        }
                        //暂停播放
                        if (val.play != this.play) {
                            this.play = val.play;
                            this.durationchange && audisDom[this.play ? 'play' : 'pause']();
                        }
                    } else {
                        //console.log('aude close',self.audioUrl)
                        //   console.log(val.searchUrl)
                        this.close()
                    }

                },
//                immediate: true,
                deep: true
            }
        },
        methods: {
            // 关闭播放
            close(pause) {
                var _this = this;

                var audisDom = this.$refs.recordingSearchAudio;
                if (this.isShow) {
//                    return ;
                    this.$store.dispatch('common/setRecordData', {
                        searchUrl: '',
                        currentTime: 0
                    });
                }
                this.isShow = false;

                if (audisDom.currentTime) {
                    audisDom.currentTime = 0;

                }
                audisDom.load();
                this.audioUrl = '';
            },
            open() {
                //this.longShow = true;
            },
            out(event) {
                if (!event.toElement) {

                    this.longShow = false;
                } else if (!this.$refs.mainAside.contains(event.toElement)) {
                    this.longShow = false;
                }
                //this.longShow = false;
            },
            init() {
                var self = this;
                var audisDom = this.$refs.recordingSearchAudio;
                // 播放结束
                audisDom.addEventListener("ended", () => {
                    console.log('ended')
                    this.close();
                });
                // 就绪获取时长
                audisDom.addEventListener("durationchange", (e) => {
                    //console.log('durationchange')
                    //console.log(audisDom.duration)  // 音频时长
                    //console.log(audisDom.paused) //  false
                    //就绪
                    this.durationchange = true;
//                    if(this.isOnePlay){
//                        audisDom.pause();
//                        setTimeout(()=>{
//                            console.log(audisDom.paused)
//                            audisDom.currentTime = 1
//                            //audisDom.play();
//                        }, 1000);
//                        this.isOnePlay = false;
//                    }
                });
                // 播放位置
                audisDom.addEventListener("timeupdate", (e) => {
//                    console.log('timeupdate', e)
//                    console.log(this.$refs.recordingSearchAudio.currentTime);
                    //console.log(audisDom.paused)
                    this.$store.dispatch('common/setRecordData', {
                        toPlayTime: 'autoplay',
                        currentTime: this.$refs.recordingSearchAudio.currentTime});
                });


            },
            handleChangeSpeed(type) {
                var playRate = '';

                if (type == 'slow') {
                    playRate = 0.5;
                } else if (type == 'normal') {
                    playRate = 1;
                } else if (type == 'quickly') {
                    playRate = 1.5;
                }

                this.$refs.recordingSearchAudio.playbackRate = playRate;

            },
        },
        mounted() {
            this.init();

        }
    }
</script>
<style lang="scss">
    .aside-div {
        position: fixed;
        top: 200px;
        right: 0;
        transform: translate(100%, 0);
        transition: all .6s;
        .out-btn {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(-100%, -50%);
            .el-row {
                padding: 4px 0;
            }
        }
        .out-btn-hide {
            opacity: 0;
        }
        .aside-div-main {
            padding: 10px;

            border: 1px solid #ccc;
            background: #fff;
        }
    }

    .aside-div-long {
        transform: translate(0%, 0);
    }

    .aside-div-main {
        audio {
            height: 40px;
        }
    }

    .handle-answer-dialog {
        .content {
            font-size: 18px;
            font-weight: bold;
            color: #4c7ee9;
        }
        .el-dialog__body {
            padding: 0px 24px !important;
        }
        .dialog-footer {
            text-align: center;
            .refuse-btn {
                background-color: #f56c6c;
                border: 1px solid #f56c6c;
            }
        }
    }
</style>

