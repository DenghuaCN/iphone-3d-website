import gsap from 'gsap';

// 滚动动画函数
export const scrollAnimation = (position, target, onUpdate) => {
  // 创建一个时间轴
  const timeLine = gsap.timeline();

  // 开始动画

  // 设置目标的动画
  timeLine.to(position, {
    /**
     * 对应webgi查看器上的相机位置/Animation/Camera Views/add current view/position
     */
    x: -3.38,
    y: -10.74,
    z: -5.93,
    scrollTrigger: {
      trigger: '.sound-section',
      // DOM / 视窗
      start: "top bottom", // 动画开始时间: 当sound-section底部与viewport顶部相遇时开始 (基本上就是页面向下滚动，sound-section的顶部进入到视窗底部时开始)
      end: "top top", // 动画结束时间: 当sound-section的顶部与viewport(视窗)顶部相遇，动画结束 (基本上就是完全展现sound-section在视窗的时候)
      scrub: 2, // 添加过渡
      immediateRender: false
    }, // 动画创建完毕
    onUpdate
  })

  // 设置相机的活动
  timeLine.to(target, {
    x: 1.52,
    y: 0.77,
    z: -1.08,
    scrollTrigger: {
      trigger: '.sound-section',
      start: "top bottom",
      end: "top   top",
      scrub: 2,
      immediateRender: false
    }
  })
}