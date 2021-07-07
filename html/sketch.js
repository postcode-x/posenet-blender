let video;
let poseNet;
let pose;
let skeleton;
let body = [];

function setup() {
    createCanvas(1280,720);
    video = createVideo(['media/pose.mp4']);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    noLoop();
    video.speed(0.1);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
    console.clear();
    console.log('PoseNet ready');
}

function mousePressed() {
    video.play(); 
    loop();
}
function mouseReleased() {
    video.pause(); 
    noLoop();
}

function draw() {
    
    image(video, 0, 0);

    if (pose) {
        
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0, 0, 255);
            ellipse(x, y, 16, 16);
        }

        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    
    }    
}

function keyPressed() {
    let tmp = []; 
    if (keyCode === UP_ARROW) {
        
        // LEFT LEG
        
        tmp.push(Math.round(pose.leftAnkle.x));
        tmp.push(Math.round(pose.leftAnkle.y));
        tmp.push(73);
        tmp.push(Math.round(pose.leftAnkle.x));
        tmp.push(Math.round(pose.leftAnkle.y));
        tmp.push(29);
        tmp.push(Math.round(pose.leftAnkle.x));
        tmp.push(Math.round(pose.leftAnkle.y));
        tmp.push(-3);
        tmp.push(Math.round(pose.leftKnee.x));
        tmp.push(Math.round(pose.leftKnee.y));
        tmp.push(48);
        tmp.push(Math.round(pose.leftHip.x));
        tmp.push(Math.round(pose.leftHip.y));
        tmp.push(24);
        
        // HIP CENTER
        
        tmp.push(Math.round(0.5*(pose.leftHip.x + pose.rightHip.x)));
        tmp.push(Math.round(0.5*(pose.leftHip.y + pose.rightHip.y)));
        tmp.push(7);
        
        // RIGHT LEG
        
        tmp.push(Math.round(pose.rightHip.x));
        tmp.push(Math.round(pose.rightHip.y));
        tmp.push(22);
        tmp.push(Math.round(pose.rightKnee.x));
        tmp.push(Math.round(pose.rightKnee.y));
        tmp.push(47);
        tmp.push(Math.round(pose.rightAnkle.x));
        tmp.push(Math.round(pose.rightAnkle.y));
        tmp.push(-6);
        tmp.push(Math.round(pose.rightAnkle.x));
        tmp.push(Math.round(pose.rightAnkle.y));
        tmp.push(21);
        tmp.push(Math.round(pose.rightAnkle.x));
        tmp.push(Math.round(pose.rightAnkle.y));
        tmp.push(51);

        // MID POINT UPPER BACK
        
        let midpointshoulderx = Math.round(0.5*(pose.rightShoulder.x + pose.leftShoulder.x));
        let midpointshouldery = Math.round(0.5*(pose.rightShoulder.y + pose.leftShoulder.y));
        let midpointhipsx = Math.round(0.5*(pose.leftHip.x + pose.rightHip.x));
        let midpointhipsy = Math.round(0.5*(pose.leftHip.y + pose.rightHip.y));
        
        // MID POINT BACK
        
        tmp.push(Math.round(0.5*(midpointshoulderx + midpointhipsx)));
        tmp.push(Math.round(0.5*(midpointshouldery + midpointhipsy)));
        tmp.push(18);
        
        // NECK
        
        tmp.push(midpointshoulderx);
        tmp.push(midpointshouldery);
        tmp.push(43);
        
        
        // ** UNIT VECTOR SETUP FOR HEAD X-Y AXIS POSITIONING **
        
        let xcomponent = midpointshoulderx -  0.5*(midpointshoulderx + midpointhipsx);
        let ycomponent = midpointshouldery -  0.5*(midpointshouldery + midpointhipsy);
        
        let magnitude = mag(xcomponent, ycomponent);
        
        let xunit = xcomponent / magnitude;
        let yunit = ycomponent / magnitude;
        
        // ** END UNIT VECTOR SETUP **
 
        
        // HEAD TOP
        
        tmp.push(Math.round(midpointshoulderx + xunit*100));
        tmp.push(Math.round(midpointshouldery + yunit*100));
        tmp.push(62);
        
        
        // RIGHT ARM
        
        tmp.push(Math.round(pose.rightShoulder.x));
        tmp.push(Math.round(pose.rightShoulder.y));
        tmp.push(33);
        tmp.push(Math.round(pose.rightElbow.x));
        tmp.push(Math.round(pose.rightElbow.y));
        tmp.push(36);
        tmp.push(Math.round(pose.rightWrist.x));
        tmp.push(Math.round(pose.rightWrist.y));
        tmp.push(38);
        tmp.push(Math.round(pose.rightWrist.x));
        tmp.push(Math.round(pose.rightWrist.y));
        tmp.push(38);
        
        // LEFT ARM
        
        tmp.push(Math.round(pose.leftShoulder.x));
        tmp.push(Math.round(pose.leftShoulder.y));
        tmp.push(32);
        tmp.push(Math.round(pose.leftElbow.x));
        tmp.push(Math.round(pose.leftElbow.y));
        tmp.push(34);
        tmp.push(Math.round(pose.leftWrist.x));
        tmp.push(Math.round(pose.leftWrist.y));
        tmp.push(37);
        tmp.push(Math.round(pose.leftWrist.x));
        tmp.push(Math.round(pose.leftWrist.y));
        tmp.push(37);
        
        // HEAD VECTOR
        
        tmp.push(Math.round(midpointshoulderx));
        tmp.push(Math.round(midpointshouldery));
        tmp.push(86);
        
        body.push(tmp);
        console.log(body);
        
  } else if (keyCode === ENTER) {
      
      save(body, 'output.json', false);
      console.log('output.json saved.')
      
  }
}
