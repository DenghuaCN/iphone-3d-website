import gsap from 'gsap';

// 滚动动画函数
export const scrollAnimation = (position, target, isMobile, onUpdate) => {
  // 创建一个时间轴
  const timeLine = gsap.timeline();

  // 开始动画

  // 设置目标的动画
  timeLine
  // 第一阶段动画开始
  .to(position, {
    /**
     * 对应webgi查看器上的相机位置/Animation/Camera Views/add current view/position
     */
    x: isMobile? -7.0 : -3.38,
    y: isMobile? -12.2 : -10.74,
    z: isMobile? -6.0 : -5.93,
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
  .to(target, { // 设置相机的活动
    x: isMobile? 0.7 : 1.52,
    y: isMobile? 1.9 : 0.77,
    z: isMobile? 0.7 : -1.08,
    scrollTrigger: {
      trigger: '.sound-section',
      start: "top bottom",
      end: "top top",
      scrub: 2,
      immediateRender: false
    }
  })
  .to('.jumbotron-section', { // 使jumbotron淡出（阻挡了canvas主体动画）
    opacity: 0,
    scrollTrigger: {
      trigger: '.sound-section',
      start: "top bottom",
      end: "top top",
      scrub: 2,
      immediateRender: false
    }
  })
  .to('.sound-section-content', { // sound-section时淡入显示
    opacity: 1,
    scrollTrigger: {
      trigger: '.sound-section',
      start: "top bottom",
      end: "top top",
      scrub: 2,
      immediateRender: false
    }
  })
  // 第一阶段动画完成
  // 第二阶段动画开始
  .to(position, {
    x: isMobile? 9.36 : 1.56,
    y: isMobile? 10.95 : 5.0,
    z: isMobile? 0.09 : 0.01,
    scrollTrigger: {
      trigger: '.display-section', // 当display-section DOM的页面位置与视窗位置发生变化的时候(具体为start end中配置)，模型位置变化
      start: "top bottom",
      end: "top top",
      scrub: 2,
      immediateRender: false
    },
    onUpdate
  })
  .to(target, {
    x: isMobile? -1.62 : -0.55,
    y: isMobile? 0.02 : 0.32,
    z: isMobile? -0.06 : 0.0,
    scrollTrigger: { // 当display-section DOM的页面位置与视窗位置发生变化的时候(具体为start end中配置)，相机位置变化
      trigger: '.display-section',
      start: "top bottom",
      end: "top top",
      scrub: 2,
      immediateRender: false
    }
  })
  .to('.display-section', { // 当display-section DOM的页面位置与视窗位置发生变化的时候(具体为start end中配置)，display-section的透明度随之变化
    opacity: 1,
    scrollTrigger: {
      trigger: '.display-section',
      start: "top bottom",
      end: "top top",
      scrub: 2,
      immediateRender: false
    }
  })
  // 第二阶段动画结束
}