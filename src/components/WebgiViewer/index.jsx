import { useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from "react"
import {
  ViewerApp, // View接口，用于创建查看器
  AssetManagerPlugin, // 用于处理资源的下载、管理、缓存、解析、加载和添加到场景。可以添加扩展以加载不同的文件类型以及导出纹理、材料和 GLTF 模型。
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  CanvasSnipperPlugin,
  AssetManagerBasicPopupPlugin,
  GammaCorrectionPlugin,
  mobileAndTabletCheck
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);

const WebgiViewer = forwardRef((props, ref) => { // forwardRef返回值是react组件，接收的参数是一个 render函数，函数签名为render(props, ref)，第二个参数将其接受的 ref 属性转发到render返回的组件中
  const canvasRef = useRef(null); // 查看器ref
  const [viewerRef, setViewerRef] = useState(null);
  const [targetRef, setTargetRef] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [positionRef, setPositionRef] = useState(null);
  const canvasContainerRef = useRef(null); // webgi-canvas-container盒子ref
  const [isPreviewMode, setIsPreviewMode] = useState(false); // 是否处于预览模式(可移动模型)

  const [isMobile, setIsMobile] = useState(false);

  useImperativeHandle(ref, () => ({ // 子组件利用useImperativeHandle可以让父组件输出任意数据
    triggerPreview() {
      setIsPreviewMode(true);

      // 点击"Try me!“时隐藏所有section，只留下canvas
      const contentRef = props.contentRef;
      contentRef.current.style.opacity = '0';
      // 删除鼠标指针
      canvasContainerRef.current.style.pointerEvents = 'all';

      // 2阶段动画到3阶段(可移动模型)的动画
      gsap.to(positionRef, {
        x: 13.04,
        y: -2.01,
        z: 2.29,
        duration: 2,
        onUpdate: () => {
          viewerRef.setDirty();
          cameraRef.positionTargetUpdated(true);
        }
      })
      // 问题： 为什么这里不能用链式调用?
      gsap.to(targetRef, { x: 0.11, y: 0.0, z: 0.0, duration: 2 });

      // 启用3D模型旋转
      viewerRef.scene.activeCamera.setCameraOptions({
        controlsEnabled: true
      })
    }
  }))

  // 不需要每次渲染都执行
  const memoizedScrollAnimation = useCallback((position, target, isMobile, onUpdate) => {
    if (!position || !target || !onUpdate) return;
    scrollAnimation(position, target, isMobile, onUpdate);
  }, [])

  // 不需要每次渲染时都初始化查看器，使用useCallBack hook
  const setupViewer = useCallback(async () => {
    // 初始化查看器
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    })

    setViewerRef(viewer);
    const isMobileOrTablet = mobileAndTabletCheck();
    setIsMobile(isMobileOrTablet);


    // 添加基本插件
    const manager = await viewer.addPlugin(AssetManagerPlugin)

    // 添加一个popup，当任何资源加载时显示进度
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // camera可以访问模型position target
    const camera = viewer.scene.activeCamera;
    const position = camera.position; // 定义位置
    const target = camera.target; // 定义相机的target
    setCameraRef(camera);
    setPositionRef(position);
    setTargetRef(target);

    // 按需使用插件
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    // await viewer.addPlugin(CanvasSnipperPlugin)

    // 添加所有插件后执行一次刷新Pipeline
    viewer.renderer.refreshPipeline()

    // 添加模型文件
    await manager.addFromPath('/scene-black.glb')

    // 去除模型黑色背景
    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    // 禁用活动相机，无法旋转3D模型
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })

    // 重置位置与相机以适合移动设备
    if (isMobileOrTablet) {
      position.set(-16.7, 1.17, 11.7);
      target.set(0, 1.37, 0);
      props.contentRef.current.className = 'mobile-or-tablet';
    }

    // 每次加载网页使其处于页面顶部
    window.scrollTo(0, 0);

    let isNeedUpdate = true;
    const onUpdate = () => {
      isNeedUpdate = true;
      viewer.setDirty();  // 设置为Dirty，表示position和target需要更新
    }
    // 给查看器添加一个时间处理器
    viewer.addEventListener('preFrame', () => {
      if (isNeedUpdate) {
        camera.positionTargetUpdated(true);
        isNeedUpdate = false;
      }
    })

    memoizedScrollAnimation(position, target, isMobile, onUpdate);

    // 添加用于调试的UI界面
    // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)
  }, [])

  // 第一次渲染时执行一次
  useEffect(() => {
    setupViewer();
  }, [])

  /**
   * @desc 退出预览模式，恢复进入预览模式前的位置与相机
   */
  const handleExit = useCallback(() => { // 同样使用useCallback，因为组件重新渲染时不需要重新创建此函数
    // 重新启用鼠标指针
    canvasContainerRef.current.style.pointerEvents = 'none';
    // 显示页面其他section
    props.contentRef.current.style.opacity = '1';
    // 重新禁用预览模式
    viewerRef.scene.activeCamera.setCameraOptions({ controlsEnabled: false })

    // 更新"是否处于预览模式"
    setIsPreviewMode(false);

    // 重新应用2阶段动画最后位置与相机视角 (注意position变量应为positionRef)
    gsap.to(positionRef, {
      x: isMobile? 9.36 : 1.56,
      y: isMobile? 10.95 : 5.0,
      z: isMobile? 0.09 : 0.01,
      scrollTrigger: {
        trigger: '.display-section',
        start: "top bottom",
        end: "top top",
        scrub: 2,
        immediateRender: false
      },
      onUpdate: () => {
        viewerRef.setDirty();
        cameraRef.positionTargetUpdated(true);
      }
    })

    gsap.to(targetRef, { // (注意target变量应为targetRef)
      x: isMobile? -1.62 : -0.55,
      y: isMobile? 0.02 : 0.32,
      z: isMobile? 0.06 : 0.0,
      scrollTrigger: {
        trigger: '.display-section',
        start: "top bottom",
        end: "top top",
        scrub: 2,
        immediateRender: false
      }
    })
  }, [canvasContainerRef, viewerRef, positionRef, cameraRef, targetRef])

  return (
    <div ref={canvasContainerRef} id="webgi-canvas-container">
      <canvas id="webgi-canvas" ref={canvasRef} />
      {
        isPreviewMode && (
          <button className="button" onClick={handleExit}>Exit</button>
        )
      }
    </div>
  )
})

export default WebgiViewer;