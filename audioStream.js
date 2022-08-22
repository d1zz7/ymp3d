'use strict'
const ytdl = require('ytdl-core')
const FFmpeg = require('fluent-ffmpeg')
const { PassThrough } = require('stream')

// get audio stream
async function getStream(url, videoParams, proxyAgent) {
    try {
        const video = await ytdl(url, {
            ...videoParams,
           requestOptions: { proxyAgent }
        })

        const stream = new PassThrough()
        const ffmpeg = new FFmpeg(video)

        await ffmpeg.format('mp3').pipe(stream)

        stream.video = video
        stream.ffmpeg = ffmpeg

        return stream
    } catch (e) {
        return e
    }
}

module.exports = getStream