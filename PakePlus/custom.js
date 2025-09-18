console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// 获取摄像头权限
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment'  // 使用后置摄像头
      } 
    });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    document.body.appendChild(video);
    
    return { stream, video };
  } catch (err) {
    console.error('摄像头访问失败:', err);
    throw err;
  }
}

// 拍照功能
async function takePhoto() {
  const { stream, video } = await initCamera();
  
  // 创建canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  
  // 绘制图像
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // 停止视频流
  stream.getTracks().forEach(track => track.stop());
  
  // 返回base64格式图片
  return canvas.toDataURL('image/jpeg');
}

// 调用示例
takePhoto().then(photoData => {
  console.log('照片数据:', photoData);
  // 这里可以添加保存或上传逻辑
});
