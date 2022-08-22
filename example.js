const Ymp3 = require('./index')

const y = new Ymp3();

/* with params
const y = new Ymp3({
    proxy: 'http://185.131.176.21:8000',
    videoParams: {
        videoFormat: 'mp4',
        quality: 'lowest',
        audioFormat: 'mp3',
    }
})
 */

y.Download('https://www.youtube.com/watch?v=sVx1mJDeUjY', '', )
    .then(videoInfo => console.log(videoInfo))
    .catch(e => console.log(e))

y.on('start',  function (commandLine) {
    console.log(commandLine)
})

y.on('progress',  function (progress) {
    console.log(progress)
})

y.on('finish',  function (fileName) {
    console.log(fileName)
})

y.on('error', function (e) {
    console.log(e)
})