'use strict'
// @d1zz7
const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
const { getVideoInfo, progressPercent } = require('./services');
const getStream = require('./audioStream');
const EventEmitter = require('events').EventEmitter;
const sanitize = require('sanitize-filename');
const HttpsProxyAgent = require('https-proxy-agent');

ffmpeg.setFfmpegPath(ffmpegPath.path) // ffmpeg path

class Ymp3 extends EventEmitter {

    constructor(params = {}) {
        super()
        this.videoParams = params.videoParams ?? {
            videoFormat: 'mp4',
            quality: 'lowest',
            audioFormat: 'mp3',
        }
        this.proxyAgent = params.proxy ? HttpsProxyAgent(params.proxy) : {}
    }

    async Download(url, outputPath = '') {
        const stream = await getStream(url, this.videoParams, this.proxyAgent)
        const videoInfo = await getVideoInfo(url)
        const fileName = outputPath ? outputPath : sanitize(videoInfo.name + '.mp3')

        const outputOptions = [
            '-id3v2_version', '4',
            '-metadata', 'title=' + videoInfo.title,
            '-metadata', 'artist=' + videoInfo.artist,
            '-metadata', 'thumbnail=' + videoInfo.thumbnail,
        ];

        try {
            ffmpeg({
                source: stream
            })
                .audioBitrate(192)
                .withAudioCodec('libmp3lame')
                .toFormat('mp3')
                .outputOption(...outputOptions)
                .on('start', function (commandLine) {
                    this.emit('start', commandLine)
                }.bind(this))
                .on('progress', function (progress) {
                    this.emit('progress', {
                        videoId: videoInfo.id,
                        percent: progressPercent(progress.timemark, videoInfo.seconds)
                    })
                }.bind(this))
                .on('error', function (err) {
                    console.log(err)
                    this.emit('error', err)
                }.bind(this))
                .on('end', function () {
                    this.emit('finish', fileName)
                }.bind(this))
                .saveToFile(fileName)
        } catch (e) {
            return e
        }

        return videoInfo
    }
}

module.exports = Ymp3;