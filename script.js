
const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const nosetip = resizedDetections[0].landmarks.positions[31]
    const lefteye = resizedDetections[0].landmarks.positions[37]
    const leftcheek = resizedDetections[0].landmarks.positions[2]
    const righteye = resizedDetections[0].landmarks.positions[46]
    const rightcheek = resizedDetections[0].landmarks.positions[16]
    const dist1 = Math.sqrt(Math.pow(leftcheek.x - rightcheek.x,2) + Math.pow(leftcheek.y - rightcheek.y,2))
    const dist2 = Math.sqrt(Math.pow(nosetip.x - rightcheek.x,2) + Math.pow(nosetip.y - rightcheek.y,2))
    const lookLeft1 = dist1/dist2
    const lookRight1 = dist2/dist1
    //console.log(nosetip);
    const dist3 = Math.sqrt(Math.pow(lefteye.x - rightcheek.x,2) + Math.pow(lefteye.y - rightcheek.y,2))
    const dist4 = Math.sqrt(Math.pow(righteye.x - rightcheek.x,2) + Math.pow(righteye.y - rightcheek.y,2))
    const lookLeft2 = dist3/dist4
    const lookRight2 = dist4/dist3

    if(lookLeft1>1.9 )
		console.log("Niggers lookin left")
	else if(lookRight1>0.78 )
    console.log("Niggers lookin right")
    else
  console.log("Looking straight")


    var ctx =  canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    //ctx.beginPath();
    //ctx.rect(nosetip.x,nosetip.y,50,50);
    //ctx.stroke();
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

/* dist3 = math.sqrt(pow(poi[2][0]-poi[4][0],2) + pow(poi[2][1]-poi[4][1],2) )
	dist4 = math.sqrt(pow(poi[3][0]-poi[4][0],2) + pow(poi[3][1]-poi[4][1],2) )
	lookLeft2 = dist3/dist4
	lookRight2 = dist4/dist3 */